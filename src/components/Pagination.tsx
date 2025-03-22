import React from 'react';
import PaginationPackage, { PaginationProps } from 'rc-pagination';
import './pagination.css';

const Pagination: React.FC<PaginationProps> = props => {
  return (
    <PaginationPackage
      className="[&>.rc-pagination-item-active]:dark:!bg-articBlue"
      prevIcon={'<'}
      nextIcon={'>'}
      {...props}
    />
  );
};

export default Pagination;
