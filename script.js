// Data Bunga (Simulasi Database)
const flowerDatabase = [
    { id: 'f1', name: 'Mawar Merah', price: 3.50, img: 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?auto=format&fit=crop&q=80&w=200' },
    { id: 'f2', name: 'Peony Pink', price: 4.50, img: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&q=80&w=200' },
    { id: 'f3', name: 'Lily Putih', price: 5.00, img: 'https://images.unsplash.com/photo-1596431940984-7a1a2e79603f?auto=format&fit=crop&q=80&w=200' },
    { id: 'f4', name: 'Chamomile', price: 2.00, img: 'https://images.unsplash.com/photo-1601918349258-00511874288d?auto=format&fit=crop&q=80&w=200' }
];

// State Aplikasi (Keranjang)
let cart = {};

// Fungsi Render Katalog Produk
function renderProducts() {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = ''; // Kosongkan grid

    flowerDatabase.forEach(flower => {
        const qty = cart[flower.id] ? cart[flower.id].qty : 0;
        
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${flower.img}" alt="${flower.name}">
            <h4>${flower.name}</h4>
            <p>$${flower.price.toFixed(2)} / tangkai</p>
            <div class="controls">
                <button onclick="updateCart('${flower.id}', -1)">-</button>
                <span>${qty}</span>
                <button onclick="updateCart('${flower.id}', 1)">+</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Fungsi Tambah/Kurang Bunga
function updateCart(id, change) {
    if (!cart[id]) {
        const flower = flowerDatabase.find(f => f.id === id);
        cart[id] = { ...flower, qty: 0 };
    }

    cart[id].qty += change;

    // Hapus dari keranjang jika jumlahnya 0
    if (cart[id].qty <= 0) {
        delete cart[id];
    }

    renderProducts();
    updateSummary();
    renderCanvas();
}

// Fungsi Update Keranjang & Total Harga
function updateSummary() {
    const cartList = document.getElementById('cart-items');
    const totalPriceEl = document.getElementById('total-price');
    cartList.innerHTML = '';
    
    let total = 0;

    for (let id in cart) {
        const item = cart[id];
        const itemTotal = item.qty * item.price;
        total += itemTotal;

        const li = document.createElement('li');
        li.innerHTML = `<span>${item.qty}x ${item.name}</span> <span>$${itemTotal.toFixed(2)}</span>`;
        cartList.appendChild(li);
    }

    totalPriceEl.innerText = `$${total.toFixed(2)}`;
}

// Fungsi Update Visual di Kanvas
function renderCanvas() {
    const canvas = document.getElementById('bouquet-canvas');
    const keys = Object.keys(cart);
    
    if (keys.length === 0) {
        canvas.innerHTML = '<p class="empty-state">Pilih bunga di panel kanan untuk mulai merangkai.</p>';
        return;
    }

    canvas.innerHTML = ''; // Kosongkan kanvas
    
    // Tumpuk gambar bunga di kanvas (Simulasi sederhana)
    let zIndex = 1;
    for (let id in cart) {
        for(let i = 0; i < cart[id].qty; i++) {
            const img = document.createElement('img');
            img.src = cart[id].img;
            img.style.position = 'absolute';
            img.style.width = '100px';
            img.style.height = '100px';
            img.style.objectFit = 'cover';
            img.style.borderRadius = '50%';
            img.style.border = '2px solid white';
            img.style.zIndex = zIndex++;
            // Beri sedikit rotasi & posisi acak agar terlihat menumpuk natural
            const rotate = (Math.random() - 0.5) * 40;
            const offsetX = (Math.random() - 0.5) * 60;
            const offsetY = (Math.random() - 0.5) * 60;
            img.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${rotate}deg)`;
            
            canvas.appendChild(img);
        }
    }
}

// Fungsi Reset
function resetCanvas() {
    cart = {};
    renderProducts();
    updateSummary();
    renderCanvas();
}

// Inisialisasi saat pertama kali dibuka
renderProducts();