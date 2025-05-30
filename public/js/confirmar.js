    let orderId = window.location.search.split('=')[1];
    let userId = window.location.search.split('=')[2];

    const mp = new MercadoPago('APP_USR-6c648660-4879-4fa7-90ab-06e16f8240d3', {
        locale: 'es-CL'
    });
    const bricksBuilder = mp.bricks();
    const renderCardPaymentBrick = async (bricksBuilder) => {
        let response = await fetch(backendUrl + '/GetOrders?orderId=' + orderId + "&userId=" + userId);
        if (response.status != 200) return alert('Error al obtener la orden');
        let json = await response.json();
    
        let transactionAmount = json.order.finalPrice;

        console.log(transactionAmount);

        const settings = {
            initialization: {
                amount: transactionAmount, // monto a ser pago. Debe ser un número entero.
                payer: {
                    email: "",
                },
            },
            customization: {
                visual: {
                    style: {
                        customVariables: {
                            theme: 'default', // | 'dark' | 'bootstrap' | 'flat'
                        }
                    }
                },
                paymentMethods: {
                    maxInstallments: 1,
                }
            },
            callbacks: {
                onReady: () => {
                    // callback llamado cuando Brick esté listo
                    let total = document.getElementById('total');
                    let formattedTotal = transactionAmount.toLocaleString('es-CL');
                    total.innerText = `Total: $${formattedTotal}`;
                    total.classList.remove('hidden');
                },
                onSubmit: (cardFormData) => {
                    cardFormData.orderId = parseInt(orderId);
                    //  callback llamado cuando el usuario haga clic en el botón enviar los datos
                    //  ejemplo de envío de los datos recolectados por el Brick a su servidor
                    return new Promise((resolve, reject) => {
                        fetch(backendUrl + "/ConfirmOrder", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(cardFormData)
                        })
                            .then((response) => {
                                // recibir el resultado del pago
                                // resolve();
                                if (response.status == 200) {
                                    resolve();
                                    localStorage.removeItem('productsIds');
                                    window.location.href = "/gracias";
                                } else {
                                    alert("Su pago fue rechazado. Por favor intente nuevamente.");
                                    reject();
                                }
                            })
                            .catch((error) => {
                                // tratar respuesta de error al intentar crear el pago
                                reject();
                            })
                    });
                },
                onError: (error) => {
                    alert("Erro al intentar hacer el pago, por favor intente más tarde.");
                    // callback llamado para todos los casos de error de Brick
                },
            },
        };
        window.cardPaymentBrickController = await bricksBuilder.create('cardPayment', 'cardPaymentBrick_container', settings);
    };
    renderCardPaymentBrick(bricksBuilder);