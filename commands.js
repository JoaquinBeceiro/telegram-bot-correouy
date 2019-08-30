exports.commands = [
    {
        command: '/help',
        func: () => {
            return 'Para utilizar el bot debe ingresar el comando <code>/track</code>. Ejemplo: <code>/track RR123456789UY</code>.'
        }
    },
    {        
        command: '/track',
        func: async args => {
            let result = 'response';

            const apiCall = await fetch(`${ahivaURL}codigoPieza=${args}`)
                .then(res => res.json())
                .then(json => json);

            const {estado, eventos, idNacional, idInternacional } = apiCall[0];

            if( estado == 'NOT_FOUND'){
                result =  args == undefined ? 
                    `Debe ingresar un tracking` : 
                    `Tracking <code>${args}</code> no encontrado.`;
            } else {

                const list = eventos.map( ele => {
                    const {fecha, evento, ubicacion } = ele;
                    const ret = 
                        `<strong>Fecha:</strong> ${fecha}\n` +
                        `<strong>Evento:</strong> ${evento}\n` +
                        `<strong>Ubicación:</strong> ${ubicacion}\n` +
                        `<pre>---------------</pre>\n`
                    return ret;
                })
                result = 
                `<strong>Id Nacional:</strong> <code>${idNacional}</code>\n` +
                `<strong>Id Internacional:</strong> <code>${idInternacional}</code>\n\n\n` +
                list.join('');

                
            }

            return result;
        }
    },
];