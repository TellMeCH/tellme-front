'use client';

import { debounce } from 'lodash';
import { useTranslations } from 'next-intl';
import { ChangeEvent, ReactElement, useCallback } from 'react';
import { Icon, TextInput, TextInputProps } from '@tellme/shared/ui/ui-kit';

interface SearchInputProps extends Omit<TextInputProps, 'onChange'> {
  onChange: (value: string) => void;
}

const debounceTimeMs = 400;

export function SearchInput({ onChange, ...restProps }: SearchInputProps): ReactElement {
  const t = useTranslations('web-shared.UI_KIT.SEARCH_INPUT');

  const changeWithDebounce = useCallback(
    debounce((event: ChangeEvent<HTMLInputElement>) => onChange?.(event.target.value), debounceTimeMs),
    [],
  );

  return (
    <TextInput
      placeholder={t('TEXT_PLACEHOLDER')}
      startContent={<Icon name='search' />}
      {...restProps}
      onChange={changeWithDebounce}
    />
  );
}
