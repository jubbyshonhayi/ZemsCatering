const BUSINESS_PHONE=+263775398825; 

// Products Data
const PRODUCTS=[
  {id:1,title:'Wedding Cake set',price:260,image:'images/cake19.jpg',category:'cakes'},
  {id:2,title:'Wedding Cake',price:300,image:'images/cake24.jpg',category:'cakes'},
  {id:3,title:'Birthday Cake',price:20,image:'images/vanilla.jpg',category:'cakes'},
  {id:4,title:'Birthday Cake',price:20,image:'images/chocolate.jpg',category:'cakes'},
  {id:5,title:'Birthday Cake',price:20,image:'images/redvelvet.jpg',category:'cakes'},
  {id:6,title:'Birthday Cake',price:20,image:'images/cake1.jpg',category:'cakes'},
  {id:7,title:'Birthday Cake',price:20,image:'images/cake2.jpg',category:'cakes'},
  {id:8,title:'Birthday Cake',price:25,image:'images/cake3.jpg',category:'cakes'},
  {id:9,title:'Birthday Cake',price:25,image:'images/cake4.jpg',category:'cakes'},
  {id:10,title:'Birthday Cake',price:25,image:'images/cake5.jpg',category:'cakes'},
  {id:11,title:'Birthday Cake',price:30,image:'images/cake8.jpg',category:'cakes'},
  {id:12,title:'Birthday Cake',price:30,image:'images/cake9.jpg',category:'cakes'},
  {id:13,title:'Birthday Cake',price:30,image:'images/cake10.jpg',category:'cakes'},
  {id:14,title:'Roora Cake',price:30,image:'images/cake11.jpg',category:'cakes'},
  {id:15,title:'Birthday Cake',price:30,image:'images/cake21.jpg',category:'cakes'},
  {id:16,title:'Birthday Cake',price:35,image:'images/cake13.jpg',category:'cakes'},
  {id:17,title:'Birthday Cake',price:35,image:'images/cake14.jpg',category:'cakes'},
  {id:18,title:'Birthday Cake',price:35,image:'images/cake20.jpg',category:'cakes'},
  {id:19,title:'Birthday Cake',price:40,image:'images/cake15.jpg',category:'cakes'},
  {id:20,title:'Birthday Cake',price:40,image:'images/cake16.jpg',category:'cakes'},
  {id:21,title:'Birthday Cake',price:45,image:'images/cake17.jpg',category:'cakes'},
  {id:22,title:'Birthday Cake',price:55,image:'images/cake22.jpg',category:'cakes'},
  {id:23,title:'Fruit Cake',price:30,image:'images/fruitcake.jpg',category:'cakes'},
  {id:24,title:'Fruit Cake',price:40,image:'images/fruitcake2.jpg',category:'cakes'},
  {id:25,title:'Event Catering per plate',price:2,image:'images/catering1.jpg',category:'catering'},
  {id:26,title:'Event Catering per plate',price:2,image:'images/catering2.jpg',category:'catering'},
  {id:27,title:'Event Catering per plate',price:2,image:'images/catering3.jpg',category:'catering'},
  {id:28,title:'Event Catering per plate',price:2,image:'images/catering4.jpg',category:'catering'},
  {id:29,title:'Event Catering per plate',price:2,image:'images/catering5.jpg',category:'catering'},
  {id:30,title:'Event Catering per plate',price:2,image:'images/catering6.jpg',category:'catering'},
  {id:31,title:'Event Catering per plate',price:2,image:'images/catering7.jpg',category:'catering'},
  {id:32,title:'Event Catering per plate',price:2,image:'images/catering8.jpg',category:'catering'},
  {id:33,title:'Party Drinks Pack',price:15,image:'images/drinks1.jpg',category:'drinks'},
  {id:34,title:'Party Drinks Each',price:0.70,image:'images/drinks2.jpg',category:'drinks'}

];

const productsContainer=document.getElementById('products-container');
const searchInput=document.getElementById('search-input');
const categoryButtons=document.querySelectorAll('.category-tabs button');

// Render Products
function renderProducts(filter='',category='all'){
  if(!productsContainer) return;
  productsContainer.innerHTML='';
  let filtered=PRODUCTS.filter(p=>{
    const matchesCategory=category==='all'||p.category===category;
    return matchesCategory && p.title.toLowerCase().includes(filter.toLowerCase());
  });
  filtered.forEach(p=>{
    const card=document.createElement('div');
    card.className='product-card';
    card.innerHTML=`
      <img src="${p.image}" alt="${p.title}">
      <div class="product-info">
        <h4>${p.title}</h4>
        <div>$${p.price.toFixed(2)}</div>
        <button>Order Now</button>
      </div>
    `;
    productsContainer.appendChild(card);
    setTimeout(()=>card.classList.add('show'),100);
    card.querySelector('button').addEventListener('click',()=>orderWhatsApp(p));
  });
}

// WhatsApp Order
function orderWhatsApp(product){
  const msg=`Hey Zems catering, I want to order: ${product.title} ($${product.price.toFixed(2)}). Can you please confirm it?`;
  window.open(`https://wa.me/${+263775398825}?text=${encodeURIComponent(msg)}`,'_blank');
}

// Search Input
searchInput?.addEventListener('input',e=>renderProducts(e.target.value,getCurrentCategory()));

// Category Filter
categoryButtons.forEach(btn=>{
  btn.addEventListener('click',()=>{
    categoryButtons.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    renderProducts(searchInput.value,getCurrentCategory());
  });
});
function getCurrentCategory(){
  const active=document.querySelector('.category-tabs button.active');
  return active?active.dataset.category:'all';
}

// Smooth Scroll for Same-Page Anchors Only
document.querySelectorAll('.btn').forEach(btn=>{
  const href = btn.getAttribute('href');
  if(href && href.startsWith('#')){
    btn.addEventListener('click',function(e){
      e.preventDefault();
      const targetId=href.substring(1);
      const target=document.getElementById(targetId);
      if(target){
        window.scrollTo({top:target.offsetTop-80,behavior:'smooth'});
      }
    });
  }

  // Modern hover animation for all buttons
  btn.addEventListener('mouseover',()=>btn.style.transform='scale(1.05)');
  btn.addEventListener('mouseout',()=>btn.style.transform='scale(1)');
});

// Initial render
renderProducts();
