document.onreadystatechange = function () {
  if (document.readyState === 'interactive') {
    //  正在进行的容器 ol
    var todolist = document.getElementById('todolist')
    // 正在进行的数量
    var todocount = document.getElementById('todocount')
    //  已经完成的容器 ul
    var donelist = document.getElementById('donelist')
    // 已经完成的数量
    var donecount = document.getElementById('donecount')
    // 需要添加的内容的表单
    var form = document.getElementById('form')
    // 需要添加的内容
    var title = document.getElementById('title')

    // 加载页面渲染数据
    load()

    // 按下回车添加内容
    title.onkeyup = function (e) {
      if (title.value === '') {
        return alert('内容不能为空')
      }
      if (e.keyCode === 13) {
        // 添加数据
        addLocal(title.value)
        // 重置表单
        form.reset()
      }
    }

    // 删除数据
    todolist.onclick = deleteData
    donelist.onclick = deleteData
    function deleteData(e) {
      if (e.target.nodeName === 'A') {
        // 获取当前元素的索引
        var index = e.target.getAttribute('id')
        // 删除当前元素
        deleteLocal(index)
      }
    }

    // 切换正在进行中
    todolist.onchange = changeCheckbox
    donelist.onchange = changeCheckbox
    function changeCheckbox(e) {
      // 判断发生改变的是否为input
      if (e.target.nodeName === 'INPUT' && e.target.type === 'checkbox') {
        // 获取当前元素的索引
        var index = getIndex(e.target, 'A')
        // 切换当前多选框的状态
        changeStatus(index, e.target)
      }
    }

    // 双击修改内容
    todolist.ondblclick = dblEdit

    function dblEdit(e) {
      if (e.target.nodeName === 'P') {
        var data = getLocal()
        // 获取当前的索引
        var index = getIndex(e.target, 'A')
        // 保存当前的内容
        var text = e.target.innerText
        // p元素内添加一个input元素
        e.target.innerHTML = "<input type='text' value=" + text + '>'
        // 获取刚刚添加的input元素
        var ipt = e.target.children[0]
        // 选中input内所有的元素
        ipt.select()
        // 监听input失去焦点事件
        ipt.onblur = function () {
          // 获取input的内容
          var val = this.value
          if (val === '') {
            alert('内容不能为空')
            // 如果为空, 内容为没修改之前的
            val = text
          }
          // 如果不为空, 内容则为修改后的内容
          data[index].title = val
          // 删除当前元素 input
          this.parentNode.innerHTML = ''
          // 保存数据到本地
          setLocal(data)
          // 重新渲染页面
          load()
        }
        ipt.onkeyup = function (e) {
          // 键盘按下空格触发失去焦点事件
          if (e.keyCode === 13) {
            this.blur()
          }
        }
        ipt.onclick = function () {
          // 当再次点击input时触发blur事件
          this.blur()
        }
      }
    }

    //将本地存储的渲染到页面
    function load() {
      // 获取本地数据
      var data = getLocal()
      // 清空容器
      todolist.innerHTML = ''
      donelist.innerHTML = ''
      // 正在进行和已经完成的数量
      var todoCount = 0
      var doneCount = 0
      // 循环本地中的数组
      for (var i = 0; i < data.length; i++) {
        // 当前的元素
        var ele = data[i]
        // 判断元素是否已经完成
        if (ele.done) {
          // 将元素添加到已经完成的容器
          donelist.innerHTML +=
            "<li draggable='true'><input type='checkbox' checked='checked'/><p>" +
            ele.title +
            "</p><a href = 'javascript:;' id=" +
            i +
            '></a></li>'
          // 已经完成的数量加1
          doneCount++
        } else {
          // 将元素添加到正在进行的容器
          todolist.innerHTML +=
            '<li><input type="checkbox"/><p>' + ele.title + '</p><a href = "javascript:;" id=' + i + '></a></li>'
          // 正在进行的数量加1
          todoCount++
        }
      }
      todocount.textContent = todoCount
      donecount.textContent = doneCount
    }
    //获取本地存储
    function getLocal() {
      var data = localStorage.getItem('todo') || '[]'

      return JSON.parse(data)
    }
    //将数据存储到本地
    function setLocal(data) {
      localStorage.setItem('todo', JSON.stringify(data))
    }
    // 向本地添加数据
    function addLocal(data) {
      // 获取本地数据
      var local = getLocal()
      // 向数组中添加数据
      local.push({ title: data, done: false })
      // 保存到本地
      setLocal(local)
      // 重新渲染页面
      load()
    }
    // 删除本地数据
    function deleteLocal(index) {
      // 获取本地数据
      var data = getLocal()
      // 删除数据
      data.splice(index, 1)
      // 保存到本地
      setLocal(data)
      // 重新渲染页面
      load()
    }
    /**
     * getIndex: 获取当前元素的索引
     * params:
     *  node: 当前的元素
     *  label： 需要查找标签的大写
     */
    function getIndex(node, label) {
      // 获取当前元素下一个节点
      var ele = node.nextSibling
      // 判断节点名字是否等于传入的标签
      while (ele.nodeName !== label) {
        // 如果不等于就等于下一个节点
        ele = ele.nextSibling
      }
      // 获取元素索引
      var index = ele.getAttribute('id')
      return index
    }
    // 修改多选框状态

    function changeStatus(index, ele) {
      // 获取本地数据
      var data = getLocal()
      // 修改当前元素的复选框状态
      data[index].done = ele.checked
      // 保存本地数据
      setLocal(data)
      // 重新渲染页面
      load()
    }
    //当在一个页面中，本地存储的值该更，其他页面中也相应的更改
    window.addEventListener('storage', load, false)
  }
}
