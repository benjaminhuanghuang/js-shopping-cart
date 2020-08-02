


## Use the id on button
```
  <button class="bag-btn" data-id="1">
```

```
  const buttons = ui.getBagButtons();
  buttons.forEach(button =>{
    let id = button.dataset.id;
  });
```

## this
```
  // 'this' is the button
  clearCartBtn.addEventListener('click', this.clearCart());    
```

## event bubbling
```
  if (event.target.classList.contains("remove-item")) {
    let removeItem = event.target;
    let id = removeItem.dataset.id;
    cartContent.removeChild(removeItem.parentElement.parentElement);
    this.remveItem(id);
  }
```