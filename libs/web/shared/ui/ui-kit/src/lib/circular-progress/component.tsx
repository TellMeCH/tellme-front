'use client';

import clsx from 'clsx';
import { type ReactElement } from 'react';
import { PieChart, Pie, Cell } from 'recharts';

interface CircularProgressProps {
  value: number;
  limitValues?: { min: number; max: number };
  trackColorClassName?: string;
  indicatorColorClassName?: string;
}

export function CircularProgress({
  value,
  limitValues = { min: 1, max: 5 },
  trackColorClassName = 'text-control-primary-transparent',
  indicatorColorClassName = 'text-control-primary',
}: CircularProgressProps): ReactElement {
  const { min, max } = limitValues;
  const minFillPercentage = 0.1;

  const total = max - min;
  const filled = value === min ? max * minFillPercentage : value - min;

  const data = [{ value: total - filled }, { value: filled }];

  return (
    <PieChart width={82} height={82}>
      <Pie
        onClick={undefined}
        data={data}
        startAngle={-25}
        endAngle={205}
        innerRadius={26}
        outerRadius={41}
        animationDuration={700}
        dataKey='value'
        paddingAngle={value === max ? 0 : -20}
        cornerRadius={16}
        stroke='none'>
        <Cell fill='currentColor' className={clsx('outline-none', trackColorClassName)} />
        <Cell fill='currentColor' className={clsx('outline-none', indicatorColorClassName)} />
      </Pie>
      <text
        x='10%'
        y='85%'
        fill='currentColor'
        textAnchor='middle'
        dominantBaseline='middle'
        fontSize={14}
        className='text-text-control'>
        {min}
      </text>
      <text
        x='50%'
        y='50%'
        textAnchor='middle'
        dominantBaseline='middle'
        fontSize={18}>
        {value}
      </text>
      <text
        x='90%'
        y='85%'
        fill='currentColor'
        textAnchor='middle'
        dominantBaseline='middle'
        fontSize={14}
        className='text-text-control'>
        {max}
      </text>
    </PieChart>
  );
}
