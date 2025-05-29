const BASE_URL = 'https://fakestoreapi.com';

async function fetchData(url, method = 'GET', body = null, headers = {}) {
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        if (response.status === 204 || response.headers.get('content-length') === '0') {
            return null; 
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error.message);
        return null;
    }
}

async function main() {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log('Uso: npm run start <comando> [opciones]');
        console.log('Comandos disponibles:');
        console.log('  GET products                         - Consulta todos los productos y muestra id, title, price');
        console.log('  GET products/<productId>             - Consulta un producto específico por ID y muestra id, title, price');
        console.log('  POST products <title> <price> <category> - Crea un nuevo producto');
        console.log('  DELETE products/<productId>          - Elimina un producto por ID'); 
        return;
    }

    const comando = args[0];
    const fuente = args[1];

    if (comando === 'GET' && fuente === 'products') {
        
            if (args.length === 2) { 
                console.log('Consultando todos los productos...');
                const products = await fetchData(`${BASE_URL}/products`);
                if (products) {
                    const simplifiedProducts = products.map(product => ({
                        id: product.id,
                        title: product.title,
                        price: product.price
                    }));
                    console.log(JSON.stringify(simplifiedProducts, null, 2));
                }
            }  
    
            if (args.length === 3 && fuente.startsWith('products/')) { 
                const productId = fuente.split('/')[1];
                if (productId) {
                    console.log(`Consultando producto con ID: ${productId}...`);
                    const product = await fetchData(`${BASE_URL}/products/${productId}`);
                    if (product) {
                        const simplifiedProduct = {
                            id: product.id,
                            title: product.title,
                            price: product.price
                        };
                        console.log(JSON.stringify(simplifiedProduct, null, 2));
                    } 
                } 
            } 
    }
        
        
    if (fuente && fuente.startsWith('products/')) {
        const parts = fuente.split('/');
        if (parts.length === 2 && parts[0] === 'products') {
            const productId = parts[1];
            console.log(`Consultando producto con ID: ${productId}...`);
            const product = await fetchData(`${BASE_URL}/products/${productId}`);
            if (product) {
                const simplifiedProduct = {
                    id: product.id,
                    title: product.title,
                    price: product.price
                };
                console.log(JSON.stringify(simplifiedProduct, null, 2));   
            }  
        }
    } 
        
    if (comando === 'POST') {
        
        if (fuente === 'products') {
            if (args.length >= 5) {
                const title = args[2];
                const price = parseFloat(args[3]);
                const category = args[4];
                const description = 'descripción del producto';
                const image = 'https://imagenPrueba.com.ar';
                console.log(`Creando producto: ${title}, Precio: ${price}, Categoría: ${category}...`);
                const newProductData = {
                    title: title,
                    price: price,
                    description: description,
                    image: image,
                    category: category,
                };
                const createdProduct = await fetchData(`${BASE_URL}/products`, 'POST', newProductData);
                if (createdProduct) {
                    console.log('Producto creado exitosamente:');
                    console.log(JSON.stringify(createdProduct, null, 2));
                } else {
                    console.log('No se pudo crear el producto.');
                }
            } 
        }
    }
    if (comando === 'DELETE') {
        if (fuente && fuente.startsWith('products/')) {
            const productId = fuente.split('/')[1];
            if (productId && !isNaN(parseInt(productId))) {
                console.log(`Eliminando producto con ID: ${productId}...`);
                const deletedProduct = await fetchData(`${BASE_URL}/products/${productId}`, 'DELETE');

                if (deletedProduct) { 
                    console.log('Producto eliminado exitosamente:');
                    
                    const simplifiedDeletedProduct = {
                        id: deletedProduct.id,
                        title: deletedProduct.title,
                        price: deletedProduct.price
                    };
                    console.log(JSON.stringify(simplifiedDeletedProduct, null, 2));
                } 
            }
        } 
    } 
}

main();