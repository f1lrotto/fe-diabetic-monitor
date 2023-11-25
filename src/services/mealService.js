async function postMeal(mealType, mealTime, currentGlucose) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/log-meal`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_BEARER_TOKEN}`
    },
    body: JSON.stringify({
      mealType,
      mealTime,
      currentGlucose
    })
  });
  if (response.ok) {
    return response.json();
  } else {
    throw new Error('Network response was not ok');
  }
}

async function getMeals() {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/meals-three-months`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_BEARER_TOKEN}`
    }
  });
  if (response.ok) {
    return response.json();
  } else {
    throw new Error('Network response was not ok');
  }
}

async function deleteMeal(mealId) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/delete-meal/${mealId}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_BEARER_TOKEN}`
    }
  });
  if (response.ok) {
    return response.json();
  } else {
    throw new Error('Network response was not ok');
  }
}

export {
  postMeal,
  getMeals,
  deleteMeal,
};
