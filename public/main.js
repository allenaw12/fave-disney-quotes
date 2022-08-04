const update = document.querySelector('#update-button')
const deleteButton = document.querySelector('#delete-button')
const messageDiv = document.querySelector('#message')


update.addEventListener('click', _ => {
    fetch('/quotes', {
        method: 'put',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
            title: document.querySelector('.new-title').value,
            name: document.querySelector('.new-name').value,
            quote: document.querySelector('.new-quote').value
        }),
    })
        .then(res => {
            if(res.ok) return res.json()
        })
        .then(response => {
            window.location.reload(true)
        })
        .catch(err => console.error(err))
})

deleteButton.addEventListener('click', _ => {
    fetch('/quotes', {
        method: 'delete',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            quote: document.querySelector('.delete-quote').value
        })
    })
        .then(res => {
            if(res.ok) return res.json()
        })
        .then(response => {
            if(response === 'No quotes to delete'){
                messageDiv.textContent = 'No quotes to delete'
            }else{
            window.location.reload()
            }
        })
        .catch(err => console.error(err))
})