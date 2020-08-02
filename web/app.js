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

        Storage.saveCart( cart);
        
        this.setCartValue(cart);

        this.addCartItem(cartItem);
      });
    });
  }

  setCartValue(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;

    cart.map(itme =>{
      tempTotal += item.price * item.amount;
      itemsTotal += itme.amount;
    });

    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
  }

  addCartItem(item) {
    const div = document.createElement('div');
    div.classList.add('cart-item');
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
    `
    cartContent.appendChild(div);
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
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();

  products
    .getProducts()
    .then((products) => {
      ui.displayProducts(products);
      Storage.saveProduts(products);
    })
    .then(() => {
      ui.getBagButtons();
    });
});
