let chart;

async function loadData(metric = "Stress Level") {
  const response = await fetch("./data.json");
  const data = await response.json();

  // 分组：Quality of Sleep -> metric[]
  const groups = {};

  data.forEach(d => {
    const q = d["Quality of Sleep"];
    const v = d[metric];

    if (!groups[q]) {
      groups[q] = [];
    }
    groups[q].push(v);
  });

  // 计算平均值
  const labels = [];
  const values = [];

  for (const q in groups) {
    const arr = groups[q];
    const avg = arr.reduce((sum, v) => sum + v, 0) / arr.length;

    labels.push(q);
    values.push(avg);
  }

  const ctx = document.getElementById("myChart");

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: `Average ${metric}`,
          data: values,
          backgroundColor: "rgba(75, 192, 192, 0.6)"
        }
      ]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: `Average ${metric} by Sleep Quality`
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// 下拉框交互
document.getElementById("metricSelect").addEventListener("change", e => {
  loadData(e.target.value);
});

// 初始加载
loadData();
