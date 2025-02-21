import { BundleID } from '../model/bundle.model';

export class BundleDto {
  constructor(
    public readonly id: BundleID,
    public readonly title: string,
    public readonly is_private: boolean,
  ) {}
}