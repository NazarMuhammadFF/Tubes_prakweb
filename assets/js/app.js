document.addEventListener('alpine:init', () => {
    Alpine.data('products', () => ({
        items: [
          { id: 1, name: 'Whiskas Junior', img: '1.jpg', price: 25000 },
          { id: 2, name: 'Pedigree Adult', img: '2.jpg', price: 26000 },
          { id: 3, name: 'Kitekat', img: '3.jpg', price: 27000 },
          { id: 4, name: 'Pedigree in can', img: '4.jpg', price: 29000 },
          { id: 5, name: 'Pudding for cat', img: '5.jpg', price: 15000 },
          { id: 6, name: 'Ancestral Grain', img: '6.jpg', price: 28000 },
          { id: 7, name: 'Premier Cookie', img: '7.jpg', price: 28000 },
          { id: 8, name: 'Monge Fresh', img: '8.jpg', price: 30000 },
          { id: 9, name: 'Cesar Simply', img: '9.jpg', price: 45000 },
          { id: 10, name: 'Dog Biscuit', img: '10.jpg', price: 58000 },
        ],
      }));


Alpine.store('cart', {
    items: [],
    total: 0,
    quantity: 0,
    add(newItem){
// cek barang yang sama
const cartItem = this.items.find((item) => item.id === newItem.id);


// jika blum ada item
if(!cartItem) {
    this.items.push({...newItem, quantity: 1, total: newItem.price});
    this.quantity++;
    this.total += newItem.price;
    }else{
        // jika barang sudah ada, cek apakah ada barang yang sama?
        this.items = this.items.map((item) => {
            // jika barang berbeda
            if (item.id !== newItem.id) {
                return item;
            }else {
                // jika barang sudah ada, tambah quantity dan totalnya
                item.quantity++;
                item.total = item.price * item.quantity;
                this.quantity++;
                this.total += item.price;
                return item;
            }
        });
    }

        console.log(this.total);
    },
    remove(id){
        // ambil item yang mau di remove
        const cartItem = this.items.find((item) => item.id === id);

        // jika item lebih dari 1
        if(cartItem.quantity > 1) {
            // telusuri
            this.items = this.items.map((item) => {
                
                if (item.id !== id) {
                    return item;
                } else {
                    item.quantity--;
                    item.total = item.price * item.quantity;
                    this.quantity--;
                    this.total -= item.price;
                    return item;
                }
            })
        } else if (cartItem.quantity === 1) {
            // jika barangnya sisa 1
            this.items = this.items.filter((item) => item.id !== id);
            this.quantity--;
            this.total -= cartItem.price;
        }
    }
});

})


// form validation 
const checkoutButton = document.querySelector('.checkout-button');
checkoutButton.disabled = true;

const form = document.querySelector('#checkoutForm');

form.addEventListener('keyup', function() {
    for(let i = 0; i < form.elements.length; i++) {
        if (form.elements[i].value.length !== 0) {
            checkoutButton.classList.remove('disabled');
            checkoutButton.classList.add('disabled');
        } else {
            return false;
        }
    }
    checkoutButton.disabled = false;
    checkoutButton.classList.remove('disabled');
});


// kirim dtaa ketika tombol checkout diclick
checkoutButton.addEventListener('click', async function (e) {
    e.preventDefault();
    const formData = new FormData(form);
    const data = new URLSearchParams(formData);
    const objData = Object.fromEntries(data);
    // const message = formatMessage(objData);
    // window.open('http://wa.me/6285877101785?text=' + encodeURIComponent(message));

    // minta transaction token menggunakan ajax
    try {
        const respone = await fetch('php/placeholder.php', {
            method: 'POST',
            body: data,
        });
        const token = await respone.text();
        // console.log(token);
        window.snap.pay(token);
        
    } catch (err) {
        console.log(err.message);
    }
})

// Format pesan ke whatsap
const formatMessage = (obj) => {
    return `Data Customer 
    Nama: ${obj.name}
    Email: ${obj.email}
    No Hp: ${obj.phone}
    Data Pesanan
    ${JSON.parse(obj.items).map((item) => `${item.name} (${item.quantity} x ${rupiah(item.total)}) \n`)}
    TOTAL: ${rupiah(obj.total)}
    Terimakasih.`;
}


// konversi ke rupiah
const rupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
}