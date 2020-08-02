// variavles
const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");

//
let cart = [];
let buttonsDOM =[];   // "add to bag" buttons 

class Products {
  async getProducts() {
    try {
      let result = await fetch("./products.json");
      let data = await result.json();
      let products = data.items;
      products = products.map((item) => {
        const { title, price } = item.fields;
        const { id } = item.sys;
        const image = item.fields.image.fields.file.url;
        return {
          id,
          title,
          price,
          image,
        };
      });
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}

class UI {
  setupApp() {
    cart = Storage.getCart();
    // set total value
    this.setCartValue(cart);
    this.populateCart(cart);

    cartBtn.addEventListener("click", this.showCart);
    closeCartBtn.addEventListener("click", this.hideCart);
  }

  displayProducts(products) {
    // console.log(products);
    let result = "";

    products.forEach((product) => {
      result += `
        <article class="product">
        <div class="img-container">
          <img src=${product.image} alt="product" class="product-img">
          <button class="bag-btn" data-id=${product.id}>
            <i class="fas fa-shopping-cart">
              add to bag
            </i>
          </button>
        </div>
        <h3>${product.title}</h3>
        <h4>$${product.price}</h4>
      </article>
      `;
    });
    productsDOM.innerHTML = result;
  }

  getBagButtons() {
    // buttons on product "Add to bag"
    const buttons = [...document.querySelectorAll(".bag-btn")];
    buttonsDOM = buttons;

    buttons.forEach((button) => {
      let id = button.dataset.id;
      let productInCart = cart.find((item) => item.id === id);
      if (productInCart) {
        button.innerText = "In Cart";
        button.disabled = true;
      }

      button.addEventListener("click", (event) => {
        event.target.innerText = "In Cart";
        event.target.disabled = true;
        //
        let cartItem = { ...Storage.getProducts(id), amount: 1 };

        cart = [...cart, cartItem];

        Storage.saveCart(cart);

        this.setCartValue(cart);

        this.addCartItem(cartItem);

        this.showCart();
      });
    });
  }

  setCartValue(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;

    cart.map((item) => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });

    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
  }

  addCartItem(item) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <img src=${item.image} alt="">
      <div>
        <h4>${item.title}</h4>
        <h5>$${item.price}</h5>
        <span class="remove-item" data-id=${item.id}>
          remove
        </span>
      </div>
      <div>
        <i class="fas fa-chevron-up" data-id=${item.id}></i>
        <p class="item-amount">${item.amount}</p>
        <i class="fas fa-chevron-down" data-id=${item.id}></i>
      </div>
    `;
    cartContent.appendChild(div);
  }

  /*
    show cart by chaning the css
  */
  showCart() {
    cartOverlay.classList.add("transparentBcg");
    cartDOM.classList.add("showCart");
  }

  hideCart() {
    cartOverlay.classList.remove("transparentBcg");
    cartDOM.classList.remove("showCart");
  }

  /*
   create cart items on UI
  */
  populateCart(cart) {
    cart.forEach((item) => this.addCartItem(item));
  }

  cartLogic() {
    // 'this' is the clearCartBtn
    // clearCartBtn.addEventListener('click', this.clearCart());

    clearCartBtn.addEventListener("click", () => {
      this.clearCart();
    });
  }

  clearCart() {
    let cartItems = cart.map(item=>item.id);
    cartItems.forEach(id=> this.removeItem(id));  // chane the products UI

    while(cartContent.children.length > 0){
      cartContent.removeChild(cartContent.children[0]);
    }
  }

  removeItem(id) {
    cart = cart.filter(item=>item.id !== id);
    this.setCartValue(cart);
    Storage.saveCart(cart);
    let button = this.getSingleButton(id);
    button.disabled = false;
    button.innerHTML = `<i class="fas fa-shopping-cart"></i>add to cart`
  }

  getSingleButton(id) {
    return buttonsDOM.find(button => button.dataset.id === id);
  }
}

class Storage {
  static saveProduts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }

  static getProducts(id) {
    let products = JSON.parse(localStorage.getItem("products"));

    return products.find((product) => product.id === id);
  }

  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  static getCart() {
    let cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();

  ui.setupApp();

  products
    .getProducts()
    .then((products) => {
      ui.displayProducts(products);
      Storage.saveProduts(products);
    })
    .then(() => {
      ui.getBagButtons();
      ui.cartLogic();
    });
});
