import { Exclude, Expose } from 'class-transformer';
import { immerable } from 'immer';
import { BaseEntity } from './base-entity';

export class PaginationResponse<TEntity extends BaseEntity = BaseEntity> {
  public [immerable] = true;

  @Expose({ toClassOnly: true })
  public results: Array<TEntity>;

  @Expose()
  public next: string; // Example http://api.example.org/accounts/?cursor=cD00ODY%3D

  @Expose()
  public previous: string; // Example http://api.example.org/accounts/?cursor=cD00ODY%3D

  @Exclude()
  public get nextCursor(): string {
    return this.getCursor(this.next);
  }

  @Exclude()
  public get previousCursor(): string {
    return this.getCursor(this.previous);
  }

  constructor(model: Partial<PaginationResponse<TEntity>>) {
    Object.assign(this, model);
  }

  private getCursor(url: string): string {
    if (!url) {
      return '';
    }

    const parsedUrl = new URL(url);

    return parsedUrl.searchParams.get('cursor') as string;
  }
}
