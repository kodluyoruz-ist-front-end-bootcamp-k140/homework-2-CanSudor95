import React, { useEffect, useState } from "react"
import { Button } from "../button"
import { FormItem } from "../form-item"
import Pagination from "../pagination/pagination"

export function DataGrid() {

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);

  const [todo, setTodo] = useState(null);

  const [sorting, setSorting] = useState("Increasing")

  useEffect(() => {
    loadData()
  }, [postsPerPage, setPostsPerPage])

  //sorting

  const sortingId = () => {
    if (sorting === "Increasing") {
      const sorted = [...items].sort((a, b) => (a.id < b.id ? -1 : 1));
      setSorting("Decreasing");
      setItems(sorted);
    } else {
      const sorted = [...items].sort((a, b) => (a.id > b.id ? -1 : 1));
      setSorting("Increasing");
      setItems(sorted);
    }
  };

  const sortingTitle = () => {
    if (sorting === "Increasing") {
      const sorted = [...items].sort((a, b) => (a.title < b.title ? -1 : 1));
      setSorting("Decreasing");
      setItems(sorted);
    } else {
      const sorted = [...items].sort((a, b) => (a.title > b.title ? -1 : 1));
      setSorting("Increasing");
      setItems(sorted);
    }
  };
  

  //postları almak
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost =indexOfLastPost-postsPerPage;
  const currentPosts = items.slice(indexOfFirstPost, indexOfLastPost);

  //sayfayı değiştirmek

  const paginate =(pageNumber) => setCurrentPage(pageNumber);


  const loadData = () => {
    setLoading(true)
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then(x => x.json())
      .then(response => {
        setItems(response)
        setLoading(false)
    }).catch(e => {
      console.log(e)
      setLoading(false)
    })
  }

  const renderBody = () => {
    return (
      <React.Fragment>
        {/*{items.sort((a, b) => b.id - a.id).map((item, i) => {  ....önceki*/}
        {currentPosts.sort((a, b) => a.id < b.id).map((item, i) => {
          return (
            <tr key={i}>
              <th scope="row" >{item.id}</th>
              <td>{item.title}</td>
              <td>{item.completed ? "Tamamlandı" : "Yapılacak"}</td>
              <td>
                <Button className="btn btn-xs btn-danger" onClick={() => onRemove(item.id)}>Sil</Button>
                <Button className="btn btn-xs btn-warning" onClick={() => onEdit(item)}>Düzenle</Button>
              </td>
            </tr>
          )
        })}
      </React.Fragment>
    )
  }

  const renderTable = () => {
    return (
    <>
      <Button onClick={onAdd}>Ekle</Button>

      {/* Sayfa başına gösterilecek verilerin dağılımını ayarlamak seçmek için..*/}
      <div>
      <h3 style={{color:"red"}}>Sayfa Sıralama</h3>
      <button type="button" className="btn btn-outline-primary pageButton"onClick={()=>setPostsPerPage(()=>{return 50})}>50</button>
      <button type="button" className="btn btn-outline-primary pageButton"onClick={()=>setPostsPerPage(()=>{return 75})}>75</button>
      <button type="button" className="btn btn-outline-primary pageButton"onClick={()=>setPostsPerPage(()=>{return 100})}>100</button>
      <button type="button" className="btn btn-outline-primary pageButton"onClick={()=>setPostsPerPage(()=>{return 200})}>200</button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th scope="col" onClick={sortingId}>#</th>
            <th scope="col"onClick={sortingTitle}>Başlık</th>
            <th scope="col">Durum</th>
            <th scope="col">Aksiyonlar</th>
          </tr>
        </thead>
        <tbody>
          {renderBody()}
        </tbody>
      </table>
      <Pagination postsPerPage={postsPerPage} totalPosts={items.length} paginate={paginate} />
    </>
    )
  }

  const saveChanges = () => {

    // insert 
    if (todo && todo.id === -1) {
      todo.id = Math.max(...items.map(item => item.id)) + 1;
      setItems(items => {
        items.push(todo)
        return [...items]
      })

      alert("Ekleme işlemi başarıyla gerçekleşti.")
      setTodo(null)
      return
    }
    // update
    const index = items.findIndex(item => item.id == todo.id)
    setItems(items => {
      items[index] = todo
      return [...items]
    })
    setTodo(null)
  }

  const onAdd = () => {
    setTodo({
      id: -1,
      title: "",
      completed: false
    })
  }

  const onRemove = (id) => {
    const status = window.confirm("Silmek istediğinize emin misiniz?")

    if (!status) {
      return
    }
    const index = items.findIndex(item => item.id == id)
    
    setItems(items => {
      items.splice(index, 1)
      return [...items]
    })
  }

  const onEdit = (todo) => {
    setTodo(todo)
  }
  
  const cancel = () => {
    setTodo(null)
  }

  const renderEditForm = () => {
    return (
      <>
        <FormItem
          title="Title"
          value={todo.title}
          onChange={e => setTodo(todos => {
            return {...todos, title: e.target.value}
          })}
        />
        <FormItem
          component="checkbox"
          title="Completed"
          value={todo.completed}
          onChange={e => setTodo(todos => {
            return {...todos, completed: e.target.checked}
          })}
        />
        <Button onClick={saveChanges}>Kaydet</Button>
        <Button className="btn btn-default" onClick={cancel}>Vazgeç</Button>
      </>
    )
  }
  
  return (
    <>
      { loading ? "Yükleniyor...." : (todo ? renderEditForm() : renderTable())}
    
    </>
  )
}