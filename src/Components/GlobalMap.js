import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { geoMiller } from 'd3-geo-projection';
import geoData from "../Data/WorldMapData.json";
import "./GlobalMap.css";

const GlobalMap = () => {
    const svgRef = useRef();

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const width = 800;
        const height = 600;

        svg.attr("width", width).attr("height", height);

        const projection = geoMiller()
            .scale(150)
            .translate([width / 2, height / 1.5]);

        const path = d3.geoPath().projection(projection);

        const colorScale = d3.scaleOrdinal()
            .domain(["Asia", "Americas", "Europe", "Africa"])
            .range(["#3498db", "#e74c3c", "#f1c40f", "#2C5F2D"]);

        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("background", "#333")
            .style("color", "#fff")
            .style("padding", "10px")
            .style("border-radius", "5px")
            .style("box-shadow", "0 4px 20px rgba(0, 0, 0, 0.3)")
            .style("transition", "opacity 0.3s")
            .style("opacity", "0");

        let tooltipTimeout;

        svg.selectAll("path")
            .data(geoData.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("fill", (d) => colorScale(d.properties.region_un))
            .attr("stroke", "none")
            .on("mouseover", function(event, d) {
                d3.select(this).style("opacity", 0.8);
                clearTimeout(tooltipTimeout);
                tooltip.html(d.properties.name)
                    .style("visibility", "visible")
                    .style("opacity", "1");
            })
            .on("mousemove", function(event) {
                tooltip.style("top", (event.pageY + 5) + "px")
                    .style("left", (event.pageX + 5) + "px");
            })
            .on("mouseout", function(event, d) {
                d3.select(this).style("opacity", 1);
                tooltipTimeout = setTimeout(() => {
                    tooltip.style("visibility", "hidden")
                        .style("opacity", "0");
                }, 200); 
            });

              
        svg.append("text")
        .attr("x", width - 170) 
        .attr("y", height - 200) 
        .attr("class", "watermark")
        .attr("text-anchor", "end") 
        .attr("font-size", "2vh") 
        .attr("fill", "#C8C8C8")
        .attr("opacity", "1")
        .text("Gnanes");

    }, []);

    return <svg ref={svgRef}></svg>;
};

export default GlobalMap;
