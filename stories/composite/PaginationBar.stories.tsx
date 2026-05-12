import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { PaginationBar } from "../../src/components/pagination-bar";

const meta: Meta<typeof PaginationBar> = {
  title: "Composite/PaginationBar",
  component: PaginationBar,
  parameters: { layout: "padded" },
};
export default meta;
type Story = StoryObj<typeof PaginationBar>;

const Demo = ({
  initialPage = 1,
  initialSize = 25,
  total = 1248,
  pageSizeOptions,
}: {
  initialPage?: number;
  initialSize?: number;
  total?: number;
  pageSizeOptions?: number[];
}) => {
  const [page, setPage] = React.useState(initialPage);
  const [pageSize, setPageSize] = React.useState(initialSize);
  return (
    <div style={{ width: 720 }}>
      <PaginationBar
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        pageSizeOptions={pageSizeOptions}
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <Demo />,
};

export const FirstPage: Story = {
  render: () => <Demo initialPage={1} />,
};

export const MiddlePage: Story = {
  render: () => <Demo initialPage={12} initialSize={50} total={1500} />,
};

export const LastPage: Story = {
  render: () => <Demo initialPage={50} initialSize={25} total={1248} />,
};

export const FewItems: Story = {
  render: () => <Demo total={8} />,
};

export const CustomPageSizes: Story = {
  render: () => <Demo pageSizeOptions={[5, 15, 30, 60]} initialSize={15} />,
};
