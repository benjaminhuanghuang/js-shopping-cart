

## Auto fit full screen
```
.hero {
  min-height: calc(100vh - 60px); /* auto fit !*/
  background: url("./images/hero-bcg.jpeg") center/cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
}
```


## Grid layout
```
.products-center {
  width: 90vw;
  margin: 0 auto;
  max-width: 1170px;
  display: grid;
  /* auto fit, min=260px, */
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  grid-column-gap: 1.5rem;
  grid-row-gap: 2rem;
}
```
4 column
```
  grid-template-columns: repeat(4, 1fr);
```

auto - all space - auto
```
.cart-item {
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr auto;
  grid-column-gap: 1.5rem;
  margin: 1.5rem 0;
}
```
## button animaiton
```
.img-container:hover .bag-btn {
  /*animation*/
  transform: translateX(0);
}
```
