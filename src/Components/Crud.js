import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

function TableCRUD({ tableName, columns }) {
  const [data, setData] = useState([]);
  const [newRow, setNewRow] = useState({});
  const [editingRow, setEditingRow] = useState(null);
  const [editedRow, setEditedRow] = useState({});

  useEffect(() => {
    async function fetchData() {
      const { data: fetchedData } = await supabase.from(tableName).select("*");
      setData(fetchedData);
    }
    fetchData();
  }, [tableName]);

  async function createRow() {
    const { error } = await supabase
      .from(tableName)
      .insert(newRow)
      .single();
    if (error) {
      console.error("Error creating row:", error);
      return;
    }
    console.log("New", newRow)
    console.log([...data, newRow])
    setData([...data, newRow]);
    setNewRow({});
  }

  async function updateRow(id, updatedData) {
    const { error } = await supabase
      .from(tableName)
      .update(updatedData)
      .eq("id", id);
    if (error) {
      console.error("Error updating row:", error);
      return;
    }
    const updatedRows = data.map((row) =>
      row.id === id ? { ...row, ...updatedData } : row
    );
    setData(updatedRows);
    setEditingRow(null);
  }

  async function deleteRow(id) {
    const { error } = await supabase.from(tableName).delete().eq("id", id);
    if (error) {
      console.error("Error deleting row:", error);
      return;
    }
    const updatedRows = data.filter((row) => row.id !== id);
    setData(updatedRows);
  }

  return (
    <div>
      <h2>{tableName}</h2>
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.name}>{column.name}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => {
            // console.log(data)
            return (
              <tr key={row !== null ? row.id : 0}>
                {columns.map((column) => {
                  return (
                    <td key={column?.name}>
                      {row ? row[column.name] : "invalid"}
                    </td>
                  );
                })}
                <td>
                  {editingRow === row.id ? (
                    <>
                      <button onClick={() => updateRow(row.id, newRow)}>
                        Save
                      </button>
                      <button onClick={() => setEditingRow(null)}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditingRow(row.id);
                          setEditedRow(row);
                        }}
                      >
                        Edit
                      </button>

                      <button onClick={() => deleteRow(row.id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
          {editingRow === "new" && (
            <tr>
              {columns.map((column) => (
                <td key={column.name}>
                  <input
                    type={column.type}
                    value={newRow[column.name] || ""}
                    onChange={(e) =>
                      setNewRow({ ...newRow, [column.name]: e.target.value })
                    }
                  />
                </td>
              ))}
              <td>
                <button onClick={createRow}>Create</button>
              </td>
            </tr>
          )}
          {editingRow !== null && (
            <tr>
              {columns.map((column) => (
                <td key={column.name}>
                  <input
                    type={column.type}
                    value={editedRow[column.name] || ""}
                    onChange={(e) =>
                      setEditedRow({
                        ...editedRow,
                        [column.name]: e.target.value,
                      })
                    }
                  />
                </td>
              ))}
              <td>
                <button onClick={() => updateRow(editedRow.id, editedRow)}>
                  Save
                </button>
                <button onClick={() => setEditingRow(null)}>Cancel</button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <button onClick={() => setEditingRow("new")}>Add row</button>
    </div>  
  );
  function ResetButton() {
    function handleResetClick() {
      window.location.reload();
    }
  
    return (
      <button onClick={handleResetClick}>Reset</button>
    );
    
  }
  
  
}

export default TableCRUD;

