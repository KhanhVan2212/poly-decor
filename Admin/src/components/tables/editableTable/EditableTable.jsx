import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BasicTableRow, Pagination } from 'api/table.api';
import { EditableCell } from './EditableCell';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { useTranslation } from 'react-i18next';
import { useMounted } from '@app/hooks/useMounted';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BasePopconfirm } from '@app/components/common/BasePopconfirm/BasePopconfirm';

const initialPagination = {
  current: 1,
  pageSize: 5,
};

export const EditableTable = forwardRef(({ getDataTable, columns, form, cancel }, ref) => {
  const [tableData, setTableData] = useState({
    data: [],
    pagination: initialPagination,
    loading: false,
  });

  const { t } = useTranslation();
  const { isMounted } = useMounted();

  const fetch = useCallback(
    (pagination: Pagination) => {
      setTableData((tableData) => ({ ...tableData, loading: true }));

      getDataTable(pagination)
        .then((res) => {
          console.log(res);
          if (isMounted.current) {
            setTableData({ data: res.data, pagination: res.pagination, loading: false });
          }
        })
        .catch((error) => {
          setTableData((tableData) => ({ ...tableData, loading: false }));
        });
    },
    [isMounted, getDataTable],
  );

  useEffect(() => {
    fetch(initialPagination);
  }, [fetch]);

  const handleTableChange = (pagination) => {
    fetch(pagination);
    cancel();
  };

  const syncData = (pagination) => {
    fetch(pagination);
  };

  // Expose the childMethod function to the parent component through the ref
  useImperativeHandle(ref, () => ({
    syncData,
  }));

  return (
    <BaseForm form={form} component={false}>
      <BaseTable
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={tableData.data}
        columns={columns}
        rowClassName="editable-row"
        pagination={{
          ...tableData.pagination,
          onChange: cancel,
        }}
        onChange={handleTableChange}
        loading={tableData.loading}
        scroll={{ x: 800 }}
      />
    </BaseForm>
  );
});
