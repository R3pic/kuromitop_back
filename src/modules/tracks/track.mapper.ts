import { Injectable } from '@nestjs/common';

import { Mapper } from '@common/base/mapper.base';

import { Track } from '@tracks/domain/track';
import { TrackEntity } from './domain/entities/track.entity';
import { MusicEntity } from './domain/entities/music.entity';
import { TrackModel } from './domain/model/track.model';
import { CreateTrackDto } from './domain/dto/create-music.dto';
import { RemoveTrackDto } from './domain/dto/remove-track.dto';
import { TrackDto } from './domain/dto/track.dto';
import { CommentDto } from '@comments/domain/dto/comment.dto';

@Injectable()
export class TrackMapper implements Mapper<
    Track, TrackModel, TrackEntity,
    never, never, RemoveTrackDto
> {
    toDomain(model: TrackModel): Track {
        return new Track(
            model.id,
            model.bundle_id,
            model.music_id,
            model.title,
            model.artist,
            model.thumbnail,
        );
    }

    toDto(model: TrackModel): TrackDto {
        return new TrackDto(
            model.id,
            model.title,
            model.artist,
            model.thumbnail,
        );
    }

    createDtoToMusicEntity(dto: CreateTrackDto): MusicEntity {
        return new MusicEntity.Builder()
            .setTitle(dto.title)
            .setArtist(dto.artist)
            .setThumbnail(dto.thumbnail)
            .build();
    }

    createDtoToEntity(): never {
        throw new Error('Method not implemented.');
    }

    updateDtoToEntity(): never {
        throw new Error('Method not implemented.');
    }

    removeDtoToEntity(dto: RemoveTrackDto): TrackEntity {
        throw new TrackEntity.Builder()
            .setId(dto.track_id)
            .build();
    }
}