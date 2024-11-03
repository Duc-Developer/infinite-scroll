import React from 'react';
import { render } from '@testing-library/react';
import InfiniteScroll from '../src';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';

describe('InfiniteScroll component', () => {
    it('renders InfiniteScroll component', () => {
        const { getByText } = render(<InfiniteScroll />);
        expect(getByText('Infinite Scroll')).toBeInTheDocument();
    });
});