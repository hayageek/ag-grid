"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var chartProxy_1 = require("../chartProxy");
var core_1 = require("@ag-grid-community/core");
var ag_charts_community_1 = require("ag-charts-community");
var chartDataModel_1 = require("../../chartDataModel");
var typeChecker_1 = require("../../typeChecker");
var object_1 = require("../../object");
var CartesianChartProxy = /** @class */ (function (_super) {
    __extends(CartesianChartProxy, _super);
    function CartesianChartProxy(params) {
        var _this = _super.call(this, params) || this;
        _this.axisTypeToClassMap = {
            number: ag_charts_community_1.NumberAxis,
            category: ag_charts_community_1.CategoryAxis,
            groupedCategory: ag_charts_community_1.GroupedCategoryAxis,
            time: ag_charts_community_1.TimeAxis
        };
        return _this;
    }
    CartesianChartProxy.prototype.getDefaultOptionsFromTheme = function (theme) {
        var _a;
        var options = _super.prototype.getDefaultOptionsFromTheme.call(this, theme);
        var standaloneChartType = this.getStandaloneChartType();
        var flipXY = standaloneChartType === 'bar';
        var xAxisType = (standaloneChartType === 'scatter' || standaloneChartType === 'histogram') ? 'number' : 'category';
        var yAxisType = 'number';
        if (flipXY) {
            _a = [yAxisType, xAxisType], xAxisType = _a[0], yAxisType = _a[1];
        }
        var xAxisTheme = {};
        var yAxisTheme = {};
        xAxisTheme = object_1.deepMerge(xAxisTheme, theme.getConfig(standaloneChartType + '.axes.' + xAxisType));
        xAxisTheme = object_1.deepMerge(xAxisTheme, theme.getConfig(standaloneChartType + '.axes.' + xAxisType + '.bottom'));
        yAxisTheme = object_1.deepMerge(yAxisTheme, theme.getConfig(standaloneChartType + '.axes.' + yAxisType));
        yAxisTheme = object_1.deepMerge(yAxisTheme, theme.getConfig(standaloneChartType + '.axes.' + yAxisType + '.left'));
        options.xAxis = xAxisTheme;
        options.yAxis = yAxisTheme;
        return options;
    };
    CartesianChartProxy.prototype.getAxisProperty = function (expression) {
        return core_1._.get(this.chartOptions.xAxis, expression, undefined);
    };
    CartesianChartProxy.prototype.setAxisProperty = function (expression, value) {
        core_1._.set(this.chartOptions.xAxis, expression, value);
        core_1._.set(this.chartOptions.yAxis, expression, value);
        var chart = this.chart;
        this.chart.axes.forEach(function (axis) { return core_1._.set(axis, expression, value); });
        chart.performLayout();
        this.raiseChartOptionsChangedEvent();
    };
    CartesianChartProxy.prototype.updateLabelRotation = function (categoryId, isHorizontalChart, axisType) {
        if (isHorizontalChart === void 0) { isHorizontalChart = false; }
        if (axisType === void 0) { axisType = 'category'; }
        var labelRotation = 0;
        var axisKey = isHorizontalChart ? 'yAxis' : 'xAxis';
        var themeOverrides = this.chartProxyParams.getGridOptionsChartThemeOverrides();
        var axisPosition = isHorizontalChart ? ag_charts_community_1.ChartAxisPosition.Left : ag_charts_community_1.ChartAxisPosition.Bottom;
        var chartType = this.getStandaloneChartType();
        var userThemeOverrideRotation;
        var commonRotation = core_1._.get(themeOverrides, "common.axes." + axisType + ".label.rotation", undefined);
        var cartesianRotation = core_1._.get(themeOverrides, "cartesian.axes." + axisType + ".label.rotation", undefined);
        var cartesianPositionRotation = core_1._.get(themeOverrides, "cartesian.axes." + axisType + "." + axisPosition + ".label.rotation", undefined);
        var chartTypeRotation = core_1._.get(themeOverrides, chartType + ".axes." + axisType + ".label.rotation", undefined);
        var chartTypePositionRotation = core_1._.get(themeOverrides, chartType + ".axes." + axisType + "." + axisPosition + ".label.rotation", undefined);
        if (typeof chartTypePositionRotation === 'number' && isFinite(chartTypePositionRotation)) {
            userThemeOverrideRotation = chartTypePositionRotation;
        }
        else if (typeof chartTypeRotation === 'number' && isFinite(chartTypeRotation)) {
            userThemeOverrideRotation = chartTypeRotation;
        }
        else if (typeof cartesianPositionRotation === 'number' && isFinite(cartesianPositionRotation)) {
            userThemeOverrideRotation = cartesianPositionRotation;
        }
        else if (typeof cartesianRotation === 'number' && isFinite(cartesianRotation)) {
            userThemeOverrideRotation = cartesianRotation;
        }
        else if (typeof commonRotation === 'number' && isFinite(commonRotation)) {
            userThemeOverrideRotation = commonRotation;
        }
        if (categoryId !== chartDataModel_1.ChartDataModel.DEFAULT_CATEGORY && !this.chartProxyParams.grouping) {
            var label = this.chartOptions[axisKey].label;
            if (label) {
                if (userThemeOverrideRotation !== undefined) {
                    labelRotation = userThemeOverrideRotation;
                }
                else {
                    labelRotation = label.rotation || 335;
                }
            }
        }
        var axis = ag_charts_community_1.find(this.chart.axes, function (currentAxis) { return currentAxis.position === axisPosition; });
        if (axis) {
            axis.label.rotation = labelRotation;
        }
    };
    CartesianChartProxy.prototype.getDefaultAxisOptions = function () {
        var fontOptions = this.getDefaultFontOptions();
        var stroke = this.getAxisGridColor();
        var axisColor = "rgba(195, 195, 195, 1)";
        return {
            title: __assign(__assign({}, fontOptions), { enabled: false, fontSize: 14 }),
            line: {
                color: axisColor,
                width: 1,
            },
            tick: {
                color: axisColor,
                size: 6,
                width: 1,
            },
            label: __assign(__assign({}, fontOptions), { padding: 5, rotation: 0 }),
            gridStyle: [{
                    stroke: stroke,
                    lineDash: [4, 2]
                }]
        };
    };
    CartesianChartProxy.prototype.getDefaultCartesianChartOptions = function () {
        var options = this.getDefaultChartOptions();
        options.xAxis = this.getDefaultAxisOptions();
        options.yAxis = this.getDefaultAxisOptions();
        return options;
    };
    CartesianChartProxy.prototype.getAxisClass = function (axisType) {
        return this.axisTypeToClassMap[axisType];
    };
    CartesianChartProxy.prototype.updateAxes = function (baseAxisType, isHorizontalChart) {
        if (baseAxisType === void 0) { baseAxisType = 'category'; }
        if (isHorizontalChart === void 0) { isHorizontalChart = false; }
        var baseAxis = isHorizontalChart ? this.getYAxis() : this.getXAxis();
        if (!baseAxis) {
            return;
        }
        if (this.chartProxyParams.grouping) {
            if (!(baseAxis instanceof ag_charts_community_1.GroupedCategoryAxis)) {
                this.recreateChart();
            }
            return;
        }
        var axisClass = this.axisTypeToClassMap[baseAxisType];
        if (baseAxis instanceof axisClass) {
            return;
        }
        var options = this.chartOptions;
        if (isHorizontalChart && !options.yAxis.type) {
            options = __assign(__assign({}, options), { yAxis: __assign({ type: baseAxisType }, options.yAxis) });
        }
        else if (!isHorizontalChart && !options.xAxis.type) {
            options = __assign(__assign({}, options), { xAxis: __assign({ type: baseAxisType }, options.xAxis) });
        }
        this.recreateChart(options);
    };
    CartesianChartProxy.prototype.isTimeAxis = function (params) {
        if (params.category && params.category.chartDataType) {
            return params.category.chartDataType === 'time';
        }
        var testDatum = params.data[0];
        var testValue = testDatum && testDatum[params.category.id];
        return typeChecker_1.isDate(testValue);
    };
    CartesianChartProxy.prototype.getXAxisDefaults = function (xAxisType, options) {
        if (xAxisType === 'time') {
            var xAxisTheme = {};
            var standaloneChartType = this.getStandaloneChartType();
            xAxisTheme = object_1.deepMerge(xAxisTheme, this.chartTheme.getConfig(standaloneChartType + '.axes.time'));
            xAxisTheme = object_1.deepMerge(xAxisTheme, this.chartTheme.getConfig(standaloneChartType + '.axes.time.bottom'));
            return xAxisTheme;
        }
        return options.xAxis;
    };
    CartesianChartProxy.prototype.getXAxis = function () {
        return ag_charts_community_1.find(this.chart.axes, function (a) { return a.position === ag_charts_community_1.ChartAxisPosition.Bottom; });
    };
    CartesianChartProxy.prototype.getYAxis = function () {
        return ag_charts_community_1.find(this.chart.axes, function (a) { return a.position === ag_charts_community_1.ChartAxisPosition.Left; });
    };
    CartesianChartProxy.prototype.processDataForCrossFiltering = function (data, colId, params) {
        var yKey = colId;
        var atLeastOneSelectedPoint = false;
        if (this.crossFiltering) {
            data.forEach(function (d) {
                d[colId + '-total'] = d[colId] + d[colId + '-filtered-out'];
                if (d[colId + '-filtered-out'] > 0) {
                    atLeastOneSelectedPoint = true;
                }
            });
            var lastSelectedChartId = params.getCrossFilteringContext().lastSelectedChartId;
            if (lastSelectedChartId === params.chartId) {
                yKey = colId + '-total';
            }
        }
        return { yKey: yKey, atLeastOneSelectedPoint: atLeastOneSelectedPoint };
    };
    CartesianChartProxy.prototype.updateSeriesForCrossFiltering = function (series, colId, chart, params, atLeastOneSelectedPoint) {
        if (this.crossFiltering) {
            // special custom marker handling to show and hide points
            series.marker.enabled = true;
            series.marker.formatter = function (p) {
                return {
                    fill: p.highlighted ? 'yellow' : p.fill,
                    size: p.highlighted ? 12 : p.datum[colId] > 0 ? 8 : 0,
                };
            };
            chart.tooltip.delay = 500;
            // make line opaque when some points are deselected
            var ctx = params.getCrossFilteringContext();
            var lastSelectionOnThisChart = ctx.lastSelectedChartId === params.chartId;
            var deselectedPoints = lastSelectionOnThisChart && atLeastOneSelectedPoint;
            if (series instanceof ag_charts_community_1.AreaSeries) {
                series.fillOpacity = deselectedPoints ? 0.3 : 1;
            }
            if (series instanceof ag_charts_community_1.LineSeries) {
                series.strokeOpacity = deselectedPoints ? 0.3 : 1;
            }
            // add node click cross filtering callback to series
            series.addEventListener('nodeClick', this.crossFilterCallback);
        }
    };
    return CartesianChartProxy;
}(chartProxy_1.ChartProxy));
exports.CartesianChartProxy = CartesianChartProxy;
//# sourceMappingURL=cartesianChartProxy.js.map