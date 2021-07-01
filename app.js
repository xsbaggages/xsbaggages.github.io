function creatingCharts(id) {

  d3.json("samples.json").then((data) => {
    var samples = data.samples;
    
    // to get elements within array that match a criteria ie. a given id
    var result = samples.filter(sampleobject => sampleobject.id == id)[0];

    var ids = result.otu_ids;

    // replacing ';' for every element in array with ',' and ' '.
    var labels = result.otu_labels.map(function(x){return x.replace(/;/g, ', ');});
    // console.log(labels);
    var values = result.sample_values;


    // Creating bubble chart with samples data
    var BubbleLayout = {
      margin: { t: 0 },
      xaxis: { title: "OTU ID" },
      hovermode: "closest",
      };

    var BubbleData = [{
        x: ids,
        y: values,
        text: labels,
        mode: "markers",
        marker: {
          color: ids,
          size: values,
        }
      }
    ];

    Plotly.plot("bubble", BubbleData, BubbleLayout);

    // building bar chart
    
    var BarData = [
      {
        // takes first 10 data and reverse it so it's high to low
        y:ids.slice(0, 10).map(otuID => 'OTU ' + otuID).reverse(),
        x:values.slice(0,10).reverse(),
        text:labels.slice(0,10).reverse(),
        type:"bar",
        orientation:"h"
      }
    ];

    var BarLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 40, l: 140 }
    };

    Plotly.newPlot("bar", BarData, BarLayout);
  });
}

function getDemoInfo(id) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;

    // to get elements within array that match a criteria ie. a given id
    var result = metadata.filter(sampleobject => sampleobject.id == id)[0];

    var canvas = d3.select("#sample-metadata");
    canvas.html("");
    Object.entries(result).forEach(([key, value]) => {
      canvas.append("h6").text(`${key}: ${value}`);
    });     
  });
}



 

function main() {

  var dropdown = d3.select("#selDataset");

  // constructing dropdown menu to display IDs
  d3.json("samples.json").then((data) => {
    var names = data.names;
    names.forEach((name) => {
      dropdown
        .append("option")
        .text(name)
        .property("value", name);
    });

    // create charts with first ID in dropdown
    var FirstName = names[0];
    creatingCharts(FirstName);
    getDemoInfo(FirstName);
  });
}

function optionChanged(newID) {
  creatingCharts(newID);
  getDemoInfo(newID);
}

// loading with main function
main();