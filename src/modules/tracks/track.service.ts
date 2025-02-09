import { Injectable, Logger } from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';
import { PostgresError } from 'pg-error-enum';

import { isDataBaseError } from '@common/utils/exception-utils';
import { RequestUser } from '@common/request-user';
import { BundleID } from '@bundle/domain/model/bundle.model';
import { CommentsService } from '@comments/comments.service';

import { TrackRepository } from './track.repository';
import { TrackMapper } from './track.mapper';

import { TrackEntity } from './domain/entities/track.entity';
import { CreateTrackDto } from './domain/dto/create-music.dto';
import { RemoveTrackDto } from './domain/dto/remove-track.dto';
import { AddCommentDto } from './domain/dto/add-comment.dto';
import {
    TrackAlreadyInBundleException, TrackForbiddenException, TrackNotFoundException, 
} from './track.errors';

@Injectable()
export class TrackService {
    private readonly logger = new Logger(TrackService.name);
    
    constructor(
        private readonly trackRepository: TrackRepository,
        private readonly mapper: TrackMapper,
        private readonly commentsService: CommentsService,
    ) {}

    @Transactional()
    async create(createTrackDto: CreateTrackDto) {
        this.logger.log(`트랙 추가 요청 Dto : ${JSON.stringify(createTrackDto)}`);
        try {
            let music = await this.trackRepository.findMusicByTitle(createTrackDto.title);

            if (music === null) {
                const entity = this.mapper.createDtoToMusicEntity(createTrackDto);
                music = await this.trackRepository.createMusic(entity);
            }

            const musicId = music.id;

            const trackEntity = new TrackEntity.Builder()
                .setMusicId(musicId)
                .setBundleId(createTrackDto.id)
                .build();

            return await this.trackRepository.create(trackEntity);
        } catch (e) {
            if (isDataBaseError(e, PostgresError.UNIQUE_VIOLATION))
                throw new TrackAlreadyInBundleException();
            throw e;
        }
    }

    @Transactional()
    async remove(removeTrackDto: RemoveTrackDto) {
        const entity = this.mapper.removeDtoToEntity(removeTrackDto);
        const track = await this.trackRepository.remove(entity);
        return track;
    }

    async findManyByBundleId(bundleId: BundleID) {
        const tracks = await this.trackRepository.findManyByBundleId(bundleId);
        const comments = await this.commentsService.findPreviewCommentsByBundle(bundleId);
        return tracks.map((track) => {
            const trackDto = this.mapper.toDto(track);
            const comment = comments.find((comment) => comment.trackId === track.id);

            return {
                ...trackDto,
                recent_comment: comment,
            };
        });
    }
    
    async findManyRecent() {
        const recentTracks = await this.trackRepository.findManyRecent();
        return recentTracks.map((track) => {
            const trackDto = this.mapper.toDto(track);

            return {
                ...trackDto,
                recent_comment: {
                    id: track.comment_id,
                    content: track.comment_content,
                    created_at: track.comment_created_at,
                    comment_count: track.comment_count,
                },
            };
        });
    }

    @Transactional()
    async addCommentToTrack(addCommentDto: AddCommentDto) {
        const track = await this.trackRepository.findById(addCommentDto.trackId);
        this.logger.log(addCommentDto.reqUser);
        this.logger.log(track?.user_id);
        if (track == null)
            throw new TrackNotFoundException();

        if (track.user_id !== addCommentDto.reqUser.id)
            throw new TrackForbiddenException();
    
        return await this.commentsService.create({
            trackId: addCommentDto.trackId,
            content: addCommentDto.content,
        });
    }

    async getTrackComments(trackId: number, reqUser: RequestUser) {
        const track = await this.trackRepository.findById(trackId);

        if (!track)
            throw new TrackNotFoundException();

        if (track.is_private && track.user_id !== reqUser.id)
            throw new TrackForbiddenException();

        const comments = await this.commentsService.findManyByBundleMusicId(trackId);
        return {
            title: track.title,
            artist: track.artist,
            thumbnail: track.thumbnail,
            comments,
        };
    }
}
