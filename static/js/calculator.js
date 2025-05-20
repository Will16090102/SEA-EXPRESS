document.addEventListener('DOMContentLoaded', function() {
    // Tab functionality
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to current tab and content
            tab.classList.add('active');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });

    // Manual Calculator Form
    const manualCalculatorForm = document.getElementById('manual-calculator-form');
    
    manualCalculatorForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get values from the form
        const price = parseFloat(document.getElementById('manual-price').value) || 0;
        const weight = parseFloat(document.getElementById('manual-weight').value) || 0;
        const productType = document.getElementById('manual-product-type').value || '';
        
        // Validate inputs
        if (price < 1) {
            showError('manual-error-message', 'El valor mínimo del producto es $1 USD.');
            return;
        }
        
        if (weight < 0.1) {
            showError('manual-error-message', 'El peso mínimo permitido es 0.1 kg.');
            return;
        }
        
        // Show loading
        document.getElementById('manual-loading').style.display = 'block';
        
        // Create form data for the request
        const formData = new FormData();
        formData.append('price', price);
        formData.append('weight', weight);
        formData.append('product_type', productType);
        
        // Send calculation request to the server
        fetch('/calculate', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en el servidor');
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                showError('manual-error-message', data.message);
                return;
            }
            
            // Update results in the UI
            updateResults(data, 'manual');
            
            // Show results section
            document.getElementById('result-manual').classList.add('visible');
            
            // Set up WhatsApp button
            setupWhatsAppBtn(data, 'manual-whatsapp-btn', 'manual');
        })
        .catch(error => {
            showError('manual-error-message', 'Error al calcular: ' + error.message);
        })
        .finally(() => {
            // Hide loading
            document.getElementById('manual-loading').style.display = 'none';
        });
    });
    
    // Amazon URL input
    const amazonUrlInput = document.getElementById('amazon-url');
    const fetchAmazonBtn = document.getElementById('fetch-amazon');
    const amazonProductData = document.getElementById('amazon-product-data');
    const amazonCalculateBtn = document.getElementById('amazon-calculate-btn');
    
    fetchAmazonBtn.addEventListener('click', function() {
        const amazonUrl = amazonUrlInput.value.trim();
        
        if (!amazonUrl) {
            showError('amazon-error-message', 'Por favor, ingresa la URL del producto');
            return;
        }
        
        // Show loading
        document.getElementById('amazon-loading').style.display = 'block';
        
        // Simular obtener datos de Amazon porque la API real no está implementada
        setTimeout(() => {
            // Generar datos de producto simulados
            const productName = parseProductNameFromUrl(amazonUrl);
            const data = {
                name: productName,
                price: Math.floor(Math.random() * 200) + 50, // Precio aleatorio entre 50 y 250
                weight: (Math.random() * 4 + 0.5).toFixed(1), // Peso aleatorio entre 0.5 y 4.5
                product_type: getProductTypeGuess(amazonUrl)
            };
            
            // Fill form with product data
            document.getElementById('amazon-price').value = data.price;
            document.getElementById('amazon-weight').value = data.weight;
            document.getElementById('amazon-product-type').value = data.product_type;
            document.getElementById('product-name').textContent = data.name;
            
            // Show product data section and enable calculate button
            amazonProductData.style.display = 'block';
            amazonCalculateBtn.disabled = false;
            
            // Hide loading
            document.getElementById('amazon-loading').style.display = 'none';
        }, 1000);
    });
    
    // Función para intentar obtener el nombre del producto de la URL
    function parseProductNameFromUrl(url) {
        try {
            // Intentar extraer el nombre del producto de la URL
            const urlObj = new URL(url);
            const pathParts = urlObj.pathname.split('/');
            
            // Buscar en la ruta para encontrar el nombre del producto
            for (let i = 0; i < pathParts.length; i++) {
                if (pathParts[i].length > 5 && pathParts[i].includes('-')) {
                    // Convertir los guiones a espacios y formatear
                    return pathParts[i]
                        .replace(/-/g, ' ')
                        .split(' ')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                        .join(' ');
                }
            }
            
            // Si no podemos extraer un nombre significativo
            if (url.includes('amazon')) {
                return 'Producto Amazon';
            } else {
                return 'Producto en línea';
            }
        } catch (e) {
            return 'Producto en línea';
        }
    }
    
    // Función para adivinar el tipo de producto basado en la URL
    function getProductTypeGuess(url) {
        const urlLower = url.toLowerCase();
        
        if (urlLower.includes('electronics') || urlLower.includes('computer') || urlLower.includes('laptop') || 
            urlLower.includes('phone') || urlLower.includes('gadget') || urlLower.includes('tech') || 
            urlLower.includes('smart') || urlLower.includes('audio') || urlLower.includes('video')) {
            return 'Electrónica';
        } else if (urlLower.includes('clothing') || urlLower.includes('fashion') || urlLower.includes('apparel') || 
                   urlLower.includes('shoe') || urlLower.includes('watch') || urlLower.includes('jewelry')) {
            return 'Ropa y accesorios';
        } else if (urlLower.includes('book') || urlLower.includes('game') || urlLower.includes('toy')) {
            return 'Libros/Juegos';
        } else if (urlLower.includes('home') || urlLower.includes('kitchen') || urlLower.includes('furniture')) {
            return 'Hogar';
        } else if (urlLower.includes('beauty') || urlLower.includes('health') || urlLower.includes('personal')) {
            return 'Salud y belleza';
        } else {
            return 'Producto general';
        }
    }
    
    // Amazon Calculator Form
    const amazonCalculatorForm = document.getElementById('amazon-calculator-form');
    
    amazonCalculatorForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get values from the form
        const price = parseFloat(document.getElementById('amazon-price').value) || 0;
        const weight = parseFloat(document.getElementById('amazon-weight').value) || 0;
        const productType = document.getElementById('amazon-product-type').value || '';
        const productName = document.getElementById('product-name').textContent;
        
        // Validate inputs
        if (price < 1) {
            showError('amazon-error-message', 'El valor mínimo del producto es $1 USD.');
            return;
        }
        
        if (weight < 0.1) {
            showError('amazon-error-message', 'El peso mínimo permitido es 0.1 kg.');
            return;
        }
        
        // Show loading
        document.getElementById('amazon-loading').style.display = 'block';
        
        // Create form data for the request
        const formData = new FormData();
        formData.append('price', price);
        formData.append('weight', weight);
        formData.append('product_type', productType);
        
        // Send calculation request to the server
        fetch('/calculate', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en el servidor');
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                showError('amazon-error-message', data.message);
                return;
            }
            
            // Add product name to data for WhatsApp
            data.product_name = productName;
            
            // Update results in the UI
            updateResults(data, 'amazon');
            
            // Show results section
            document.getElementById('result-amazon').classList.add('visible');
            
            // Set up WhatsApp button
            setupWhatsAppBtn(data, 'amazon-whatsapp-btn', 'amazon');
        })
        .catch(error => {
            showError('amazon-error-message', 'Error al calcular: ' + error.message);
        })
        .finally(() => {
            // Hide loading
            document.getElementById('amazon-loading').style.display = 'none';
        });
    });
    
    // Helper function to update the results section
    function updateResults(data, prefix) {
        // Obtenemos las secciones necesarias
        const resultSection = document.getElementById(`result-${prefix}`);
        const tabContent = document.getElementById(`${prefix}-tab`);
        const formSection = tabContent.querySelector('.form-section');
        
        // Ocultar la sección de resultados antes de actualizar
        if (resultSection.classList.contains('visible')) {
            resultSection.classList.remove('visible');
            tabContent.classList.remove('with-results');
            
            // Esperamos un momento antes de actualizar y volver a mostrar
            setTimeout(() => {
                updateResultValues(data, prefix);
                
                // Añadimos los índices para la animación escalonada
                const resultItems = resultSection.querySelectorAll('.result-item');
                resultItems.forEach((item, index) => {
                    item.style.setProperty('--item-index', index);
                });
                
                // Mostramos de nuevo con animación
                resultSection.classList.add('visible');
                tabContent.classList.add('with-results');
                
                // Registrar en Google Analytics (si está disponible)
                if (typeof gtag === 'function') {
                    gtag('event', 'calculate_shipping', {
                        'event_category': 'shipping',
                        'event_label': prefix,
                        'value': Math.round(data.total)
                    });
                }
            }, 300);
        } else {
            updateResultValues(data, prefix);
            
            // Añadimos los índices para la animación escalonada
            const resultItems = resultSection.querySelectorAll('.result-item');
            resultItems.forEach((item, index) => {
                item.style.setProperty('--item-index', index);
            });
            
            // Mostramos por primera vez con animación
            setTimeout(() => {
                resultSection.classList.add('visible');
                tabContent.classList.add('with-results');
                
                // Registrar en Google Analytics (si está disponible)
                if (typeof gtag === 'function') {
                    gtag('event', 'calculate_shipping', {
                        'event_category': 'shipping',
                        'event_label': prefix,
                        'value': Math.round(data.total)
                    });
                }
            }, 100);
        }
    }
    
    // Actualiza los valores del resultado
    function updateResultValues(data, prefix) {
        // Update price
        document.getElementById(`${prefix}-product-price`).textContent = `$${data.product_price}`;
        
        // Update weight
        document.getElementById(`${prefix}-physical-weight`).textContent = `${data.weight} kg`;
        
        // Update product type if available
        if (data.product_type) {
            if (prefix === 'manual') {
                const productTypeElement = document.getElementById(`${prefix}-product-type-display`);
                if (productTypeElement) {
                    productTypeElement.textContent = data.product_type || 'ropa';
                }
            } else if (prefix === 'amazon') {
                const productNameElement = document.getElementById('product-name');
                if (productNameElement) {
                    productNameElement.textContent = data.product_type || data.product_name || 'ropa';
                }
            }
        }
        
        // Update costs
        document.getElementById(`${prefix}-shipping-cost`).textContent = `$${data.shipping_cost}`;
        document.getElementById(`${prefix}-customs-fee`).textContent = `$${data.customs_fee}`;
        document.getElementById(`${prefix}-import-tax`).textContent = `$${data.import_tax}`;
        document.getElementById(`${prefix}-total-shipping`).textContent = `$${data.total_shipping}`;
        
        // Update total
        document.getElementById(`${prefix}-total-cost`).textContent = `$${data.total}`;
        
        // Si es Amazon, actualizamos también el precio en la sección de producto
        if (prefix === 'amazon') {
            document.getElementById('amazon-product-price-result').textContent = `$${data.product_price}`;
        }
    }
    
    // Set up WhatsApp button with quote message
    function setupWhatsAppBtn(data, btnId, prefix) {
        const whatsappBtn = document.getElementById(btnId);
        
        let message = `Hola SEA Express! Estoy interesado en cotizar un envío:\n\n`;
        
        if (prefix === 'amazon' && data.product_name) {
            message += `Producto: ${data.product_name}\n`;
        }
        
        if (data.product_type && data.product_type !== '-') {
            message += `Tipo: ${data.product_type}\n`;
        }
        
        message += `Valor: $${data.product_price}\n`;
        message += `Peso: ${data.weight} kg\n`;
        message += `Costo de envío: $${data.shipping_cost}\n`;
        message += `Desaduanaje: $${data.customs_fee}\n`;
        
        if (data.import_tax > 0) {
            message += `Impuestos: $${data.import_tax}\n`;
        }
        
        message += `Total envío: $${data.total_shipping}\n`;
        message += `Costo total: $${data.total}\n\n`;
        message += `Me gustaría confirmar este envío y consultar por métodos de pago.`;
        
        const encodedMessage = encodeURIComponent(message);
        const whatsappNumber = '51993796364'; // WhatsApp number
        
        whatsappBtn.href = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    }
    
    // Show error message
    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        // Hide error after 5 seconds
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    }
});
