import { BaseQueryArg } from '@reduxjs/toolkit/query';
import { BaseQueryFunction, createEntityInstance } from '@ronas-it/rtkq-entity-api';
import { ClassConstructor, instanceToPlain } from 'class-transformer';
import { ModifiedBaseEntity } from '../models';

export const createMutationQueryWithData = <TModifiedEntity extends ModifiedBaseEntity>(
  method: 'post' | 'patch',
  getUrl: (params: Partial<TModifiedEntity>) => string,
  modifiedEntityConstructor: ClassConstructor<ModifiedBaseEntity>,
): typeof query => {
  const query = (params: Partial<TModifiedEntity>): BaseQueryArg<BaseQueryFunction> => {
    const request = createEntityInstance(modifiedEntityConstructor, params, { fromInstancePartial: true });

    return {
      method,
      url: getUrl(params),
      data: instanceToPlain(request),
    };
  };

  return query;
};
