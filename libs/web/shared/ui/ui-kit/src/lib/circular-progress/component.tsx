'use client';

import clsx from 'clsx';
import dynamic from 'next/dynamic';
import { type ReactElement } from 'react';
import { Pie, Cell } from 'recharts';

// Workaround: https://github.com/recharts/recharts/issues/2272#issuecomment-802096207
const PieChart = dynamic(() => import('recharts').then((mod) => mod.PieChart), { ssr: false });

interface CircularProgressProps {
  value: number;
  limitValues?: { min: number; max: number };
  color?: 'primary' | 'secondary';
}

const colorVariants: Record<string, { track: string; indicator: string }> = {
  primary: {
    track: 'text-control-primary-transparent',
    indicator: 'text-control-primary',
  },
  secondary: {
    track: 'text-control-secondary-transparent',
    indicator: 'text-control-secondary',
  },
};

export function CircularProgress({
  value,
  limitValues = { min: 1, max: 5 },
  color = 'primary',
}: CircularProgressProps): ReactElement {
  const { track, indicator } = colorVariants[color];

  const { min, max } = limitValues;
  const minFillPercentage = 0.1;

  const total = max - min;
  const filled = value === min ? max * minFillPercentage : value - min;

  const data = [{ value: total - filled }, { value: filled }];

  return (
    <PieChart width={82} height={82}>
      <Pie
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
        <Cell fill='currentColor' className={clsx('outline-none', track)} />
        <Cell fill='currentColor' className={clsx('outline-none', indicator)} />
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
