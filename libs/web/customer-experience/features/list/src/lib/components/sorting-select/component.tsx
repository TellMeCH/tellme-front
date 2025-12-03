import { SharedSelection } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { ReactElement } from 'react';
import { CustomerOrdering } from '@tellme/web/shared/data-access/api';
import { AppSelect } from '@tellme/web/shared/ui/ui-kit';

interface SortingSelectProps {
  value?: CustomerOrdering;
  onChange: (value: CustomerOrdering) => void;
}

export function SortingSelect({ value, onChange }: SortingSelectProps): ReactElement {
  const t = useTranslations('customer-experience.LIST.SORTING_SELECT');

  const optionsData: Record<CustomerOrdering, string> = {
    '-last_conversation_date': t('TEXT_NEWEST_FIRST'),
    last_conversation_date: t('TEXT_OLDEST_FIRST'),
    '-avg_sentiment': t('TEXT_CUSTOMER_ENGAGEMENT'),
    '-total_revenue': t('TEXT_BIGGEST_REVENUE'),
    total_revenue: t('TEXT_SMALLEST_REVENUE'),
  };

  const options = Object.entries(optionsData).map(([key, title]) => ({
    key,
    title,
  }));

  const handleChange = (keys: SharedSelection): void => {
    onChange(keys.currentKey as CustomerOrdering);
  };

  return (
    <div className='w-[220px]'>
      <AppSelect
        aria-label={t('TEXT_SORTING')}
        options={options}
        selectedKeys={value ? [value] : []}
        onSelectionChange={handleChange}
        renderValue={(selectedItems) => t('TEXT_SORT_BY', { ordering: selectedItems[0].textValue?.toLowerCase() })}
      />
    </div>
  );
}
