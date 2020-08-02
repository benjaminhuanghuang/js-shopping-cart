


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