import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input } from "antd";
import { supabase } from "./supabaseClient";

const CrudPage = ({ tableName, columns }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [record, setRecord] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase.from(tableName).select("*");
    if (error) console.error(error);
    else setData(data);
    setLoading(false);
  };

  const handleAdd = () => {
    setRecord(null);
    setVisible(true);
  };

  const handleEdit = (record) => {
    setRecord(record);
    setVisible(true);
  };

  const handleDelete = async (record) => {
    const { error } = await supabase.from(tableName).delete().eq("id", record.id);
    if (error) console.error(error);
    else fetchData();
  };

  const handleSave = async (values) => {
    setVisible(false);
    if (record) {
      const { error } = await supabase.from(tableName).update(values).eq("id", record.id);
      if (error) console.error(error);
    } else {
      const { error } = await supabase.from(tableName).insert(values);
      if (error) console.error(error);
    }
    fetchData();
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const columnsToShow = columns.map((key) => ({
    title: key,
    dataIndex: key,
    key: key,
  }));

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: "16px" }}>
        <Button type="primary" onClick={handleAdd}>
          Add
        </Button>
      </div>
      <Table
        dataSource={data}
        columns={[...columnsToShow, { title: "Actions", key: "actions", render: (text, record) => (
          <span>
            <Button type="link" onClick={() => handleEdit(record)}>
              Edit
            </Button>
            <Button type="link" danger onClick={() => handleDelete(record)}>
              Delete
            </Button>
          </span>
        ) }]}
        loading={loading}
        rowKey="id"
      />
      <Modal
        title={record ? "Edit Record" : "Add Record"}
        visible={visible}
        onOk={() => {
          const form = document.getElementById("recordForm");
          form.dispatchEvent(new Event("submit"));
        }}
        onCancel={handleCancel}
        okButtonProps={{ htmlType: "submit", form: "recordForm" }}
      >
        <Form id="recordForm" onFinish={handleSave} initialValues={record}>
          {columns.map((key) => (
            <Form.Item
              key={key}
              name={key}
              rules={[{ required: true, message: `${key} is required` }]}
            >
              <Input />
            </Form.Item>
          ))}
        </Form>
      </Modal>
    </div>
  );
};

const SupabaseCrudApp = ({ columnNames }) => {
  const [tableNames, setTableNames] = useState([]);

  const fetchTableNames = async () => {
    const { data, error } = await supabase
      .from("information_schema.tables")
      .select("table_name")
  .eq("table_schema", "public")
  .eq("table_type", "BASE TABLE");
if (error) console.error(error);
else setTableNames(data.map((row) => row.table_name));
};

useEffect(() => {
fetchTableNames();
}, []);

return (
<div>
{tableNames.map((tableName) => (
<CrudPage key={tableName} tableName={tableName} columns={columnNames} />
))}
</div>
);
};

export default SupabaseCrudApp;
