import { EntityTagID } from '@ronas-it/rtkq-entity-api';
import { BaseEntity, PaginationResponse } from '../models';

export const createListTagsProvider = <TEntity extends BaseEntity>(entityName: string): typeof provider => {
  const provider = (response?: PaginationResponse<TEntity>): Array<{ type: string; id: string | number }> => [
    { type: entityName, id: EntityTagID.LIST },
    ...(response?.results.map((result) => ({ type: entityName, id: result.id || result.idFromUrl })) || []),
  ];

  return provider;
};
