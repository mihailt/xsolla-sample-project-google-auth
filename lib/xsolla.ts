const fetchItems = async () => {
  const url = `https://store.xsolla.com/api/v2/project/${process.env.NEXT_PUBLIC_XSOLLA_PROJECT_ID}/items?locale=en`
  
  const resp = await fetch(url, 
    { cache: "no-store" }
  );
  return resp.json();
};

const createOrder = async ({projectId, apiKey, sku, sandbox, email, userId}: {projectId: string, apiKey: string, sku: string, sandbox: boolean, email: string, userId: string}) => {

  const payload = {
    user: {
      id: {value: userId},
      name: {
        value: email
      },
      email: {
        value: email
      },
      country: {
        value: 'US',
        allow_modify: false
      }
    },
    purchase: {
      items: [
        {
          sku: sku,
          quantity: 1
        }
      ]
    },
    sandbox,
    settings: {
      language: 'en',
      currency: 'USD',
      return_url: process.env.NEXTAUTH_URL,
      ui: {
        theme: '63295aab2e47fab76f7708e3'
      }
    }
  }

  const resp = await fetch(
    `https://store.xsolla.com/api/v2/project/${projectId}/admin/payment/token`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa(`${projectId}:${apiKey}`)
      },
      body: JSON.stringify(payload)
    }
  );
  
  const json = await resp.json()

  return json;
}

const fetchOrder = async ({projectId, orderId, token}: {projectId: string, orderId: string, token?: string}) => {
  const resp = await fetch(
    `https://store.xsolla.com/api/v2/project/${projectId}/order/${orderId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return resp.json();
}



const XsollaApi = {
  fetchItems,
  createOrder,
  fetchOrder
}

export default XsollaApi