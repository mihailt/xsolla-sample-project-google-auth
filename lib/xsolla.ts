const fetchItems = async () => {
  const url = `https://store.xsolla.com/api/v2/project/${process.env.NEXT_PUBLIC_XSOLLA_PROJECT_ID}/items?locale=en`
  
  const resp = await fetch(url, 
    { cache: "no-store" }
  );
  return resp.json();
};

const XsollaApi = {
  fetchItems,
}

export default XsollaApi