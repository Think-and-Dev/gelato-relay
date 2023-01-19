
export async function getTaskStatus(taskId: string) {
  console.log(`Sending increaseCounter meta-tx using Gelato`);


  const reponse = await fetch(`/api/status?transactionId=${taskId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return reponse.json();
}

