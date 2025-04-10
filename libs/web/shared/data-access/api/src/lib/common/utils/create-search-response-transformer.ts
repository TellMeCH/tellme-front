import { createEntityInstance } from '@ronas-it/rtkq-entity-api';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { BaseEntity, PaginationResponse } from '../models';

export const createSearchResponseTransformer = <TEntity extends BaseEntity>(
  entityConstructor: ClassConstructor<TEntity>,
): typeof transformer => {
  const transformer = (response: PaginationResponse<TEntity>): PaginationResponse<TEntity> => {
    const { results, next, previous } = plainToInstance(PaginationResponse<TEntity>, response as object);

    return new PaginationResponse<TEntity>({
      next,
      previous,
      results: results.map((result) => createEntityInstance<TEntity>(entityConstructor, result)),
    });
  };

  return transformer;
};
