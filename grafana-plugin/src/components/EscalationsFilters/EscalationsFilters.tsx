import React, { ChangeEvent, FC, useCallback } from 'react';

import { Icon, Input, Button } from '@grafana/ui';
import cn from 'classnames/bind';

import styles from './EscalationsFilters.module.css';

export interface Filters {
  searchTerm: string;
}

interface EscalationsFiltersProps {
  value: Filters;
  onChange: (filters: Filters) => void;
}

const cx = cn.bind(styles);

const EscalationsFilters: FC<EscalationsFiltersProps> = (props) => {
  const { value, onChange } = props;

  const onSearchTermChangeCallback = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const filters = {
        ...value,
        searchTerm: e.currentTarget.value,
      };

      onChange(filters);
    },
    [onChange, value]
  );

  const handleClear = useCallback(() => {
    onChange({ searchTerm: '' });
  }, [onChange]);

  return (
    <div className={cx('root')}>
      <Input
        autoFocus
        className={cx('search')}
        prefix={<Icon name="search" />}
        placeholder="Search escalations..."
        value={value.searchTerm}
        onChange={onSearchTermChangeCallback}
      />
      <Button variant="secondary" icon="times" onClick={handleClear} className={cx('clear-button')}>
        Clear filters
      </Button>
    </div>
  );
};

export default EscalationsFilters;
