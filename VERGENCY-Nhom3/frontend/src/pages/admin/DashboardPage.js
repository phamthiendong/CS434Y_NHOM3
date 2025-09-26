import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import Spinner from '../../components/Spinner';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import './DashboardPage.css';
import { 
    FaArrowUp, FaArrowDown, FaRegCalendarAlt, FaChevronLeft, FaChevronRight, 
    FaTshirt, FaTag, FaUserSecret, FaDollarSign, FaShoppingCart, FaChartBar, 
    FaTimes, FaArrowLeft
} from 'react-icons/fa';
import api from '../../services/api'; 

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const DateSelectorModal = ({ 
    isOpen, 
    onClose, 
    onApplyFilter, 
    onYearChange, 
    initialYear,
    availableMonths, 
    loadingAvailability 
}) => {
    const [activeTab, setActiveTab] = useState('Tháng');
    const [year, setYear] = useState(initialYear);
    const [viewMode, setViewMode] = useState('months');
    const [monthForWeeks, setMonthForWeeks] = useState(new Date().getMonth() + 1);
    
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedWeekData, setSelectedWeekData] = useState(null);

    const handleYearChange = useCallback(onYearChange, []);
    useEffect(() => {
        handleYearChange(year);
    }, [year, handleYearChange]);
    
    useEffect(() => {
        setViewMode('months');
        setSelectedMonth(null);
        setSelectedWeekData(null);
    }, [activeTab]);

    if (!isOpen) return null;

    const handleApply = () => {
        let filter = null;
        if (activeTab === 'Tháng' && selectedMonth) {
            filter = { type: 'month', year, value: selectedMonth };
        } else if (activeTab === 'Tuần' && selectedWeekData) {
            filter = { type: 'week', ...selectedWeekData };
        }
        onApplyFilter(filter);
        onClose();
    };
    
    const handleClearFilter = () => { onApplyFilter(null); onClose(); };

    const getWeekNumber = (d) => {
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        return weekNo;
    }

    const getWeeksInMonth = (year, month) => {
        const weeks = new Set(); 
        const firstDay = new Date(year, month - 1, 1);
        const lastDay = new Date(year, month, 0);
        
        for (let d = firstDay; d <= lastDay; d.setDate(d.getDate() + 1)) {
            weeks.add(getWeekNumber(new Date(d)));
        }
        return Array.from(weeks).sort((a,b) => a-b);
    };

    const renderMonthSelectorForWeeks = () => (
        <div className="month-grid">
            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <button 
                    key={month} 
                    className="month-item"
                    onClick={() => {
                        setMonthForWeeks(month);
                        setViewMode('weeks');
                    }}
                >
                    Tháng {month}
                </button>
            ))}
        </div>
    );

    const renderWeekSelector = () => {
        const weeks = getWeeksInMonth(year, monthForWeeks);
        return (
            <>
                <div className="week-view-header" onClick={() => setViewMode('months')}>
                    <FaChevronLeft /> <span>Quay lại chọn tháng</span>
                </div>
                <div className="month-grid">
                    {weeks.map(week => (
                        <button 
                            key={week} 
                            className={`month-item ${selectedWeekData?.week === week ? 'active' : ''}`}
                            onClick={() => setSelectedWeekData({ year, week })}
                        >
                            Tuần {week}
                        </button>
                    ))}
                </div>
            </>
        );
    };

    return (
        <div className="date-modal-overlay" onClick={onClose}>
            <div className="date-modal-content" onClick={e => e.stopPropagation()}>
                <button className="date-modal-close-btn" onClick={onClose}><FaTimes /></button>
                <h4 className="date-modal-title">Chọn thời gian hiển thị</h4>
                <div className="date-modal-tabs">
                    <button className={`tab-btn ${activeTab === 'Tuần' ? 'active' : ''}`} onClick={() => setActiveTab('Tuần')}>Tuần</button>
                    <button className={`tab-btn ${activeTab === 'Tháng' ? 'active' : ''}`} onClick={() => setActiveTab('Tháng')}>Tháng</button>
                </div>
                <div className="year-selector">
                    <button onClick={() => setYear(y => y - 1)}><FaChevronLeft /></button>
                    <span>{year}</span>
                    <button onClick={() => setYear(y => y + 1)}><FaChevronRight /></button>
                </div>
                {activeTab === 'Tháng' ? (
                    <div className="month-grid">
                        {loadingAvailability ? <Spinner /> : Array.from({ length: 12 }, (_, i) => i + 1).map(month => {
                            const isAvailable = availableMonths.includes(month);
                            return <button key={month} className={`month-item ${selectedMonth === month ? 'active' : ''} ${!isAvailable ? 'disabled' : ''}`} onClick={() => isAvailable && setSelectedMonth(month)} disabled={!isAvailable}>Tháng {month}</button>;
                        })}
                    </div>
                ) : (
                    viewMode === 'months' ? renderMonthSelectorForWeeks() : renderWeekSelector()
                )}
                <div className="date-modal-actions">
                    <button className="action-btn-secondary" onClick={handleClearFilter}>Xoá bộ lọc</button>
                    <button className="action-btn-primary" onClick={handleApply}>Áp dụng</button>
                </div>
            </div>
        </div>
    );
};


const DetailedView = ({ 
    categoryData,
    ordersByCategory,
    comparisonData,
    currentMonthRevenue, 
    lastMonthRevenue, 
    totalOrdersThisMonth,
    totalOrdersLastMonth,
    onBack 
}) => {
    const [activeTab, setActiveTab] = useState('Doanh thu');

    const commonBarChartOptions = (unit) => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: { 
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        if (context.parsed.y === 0) return null;
                        return `${context.dataset.label}: ${context.parsed.y.toLocaleString('vi-VN')}${unit === 'đ' ? 'đ' : ''}`;
                    }
                }
            }
        },
        scales: {
            x: { grid: { display: false } },
            y: {
                beginAtZero: true,
                title: { display: true, text: unit === 'đ' ? '(Triệu)' : '(Đơn)', align: 'end' },
                ticks: {
                    callback: function(value) {
                        if (unit === 'đ') {
                            if (value === 0) return '0';
                            return (value / 1000000).toFixed(1);
                        }
                        return Number.isInteger(value) ? value : '';
                    }
                }
            }
        }
    });
    
    const chartBackgroundColor = (context) => {
        const chart = context.chart;
        const { ctx, chartArea } = chart;
        if (!chartArea) return null;
        if (context.dataIndex === context.dataset.data.length - 1) {
            const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
            gradient.addColorStop(0, 'rgba(59, 130, 246, 0.6)');
            gradient.addColorStop(1, 'rgba(59, 130, 246, 1)');
            return gradient;
        }
        return 'rgba(59, 130, 246, 0.2)';
    };

    const revenueBarChartData = {
        labels: ['Tháng 5', 'Tháng 6', 'Tháng 7'],
        datasets: [{
            label: 'Doanh thu',
            data: [0, lastMonthRevenue || 0, currentMonthRevenue || 0],
            barPercentage: 0.4,
            borderRadius: 10,
            backgroundColor: chartBackgroundColor,
            borderWidth: 0,
        }]
    };
    
    const ordersBarChartData = {
        labels: ['Tháng 5', 'Tháng 6', 'Tháng 7'],
        datasets: [{
            label: 'Đơn hàng',
            data: [0, totalOrdersLastMonth || 0, totalOrdersThisMonth || 0],
            barPercentage: 0.4,
            borderRadius: 10,
            backgroundColor: chartBackgroundColor,
            borderWidth: 0,
        }]
    };

    return (
        <div className="detailed-view-container">
            <div className="detailed-view-header">
                <h3>Chi tiết Doanh thu</h3>
                <button onClick={onBack} className="back-btn"><FaArrowLeft /> Quay lại</button>
            </div>
            <div className="view-tabs">
                <button className={`view-tab-btn ${activeTab === 'Doanh thu' ? 'active' : ''}`} onClick={() => setActiveTab('Doanh thu')}>Doanh thu</button>
                <button className={`view-tab-btn ${activeTab === 'Đơn hàng' ? 'active' : ''}`} onClick={() => setActiveTab('Đơn hàng')}>Đơn hàng</button>
                <button className={`view-tab-btn ${activeTab === 'Chênh lệch' ? 'active' : ''}`} onClick={() => setActiveTab('Chênh lệch')}>Sản Phẩm Bán Chạy</button>
            </div>

            {activeTab === 'Doanh thu' && (
                <>
                    <div className="detailed-total-card">
                        <div className="total-label">Tổng doanh thu tháng 7</div>
                        <div className="total-amount">{currentMonthRevenue.toLocaleString('vi-VN')}đ</div>
                    </div>
                    <div className="bar-chart-container">
                        <Bar options={commonBarChartOptions('đ')} data={revenueBarChartData} />
                    </div>
                    <div className="detailed-list-header"><h4>Doanh thu tháng 7 theo sản phẩm</h4></div>
                    <div className="detailed-list-single-column">
                        {categoryData.map((item, index) => (
                            <div key={index} className="detailed-list-item-single">
                                <div className="item-info">
                                    <div className="item-icon" style={{ backgroundColor: index % 2 === 0 ? '#a78bfa' : '#f87171' }}><FaTshirt /></div>
                                    <div className="item-details"><div className="item-name">{item._id}</div></div>
                                </div>
                                <div className="item-revenue"><div className="current-revenue">{item.revenue.toLocaleString('vi-VN')}đ</div></div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {activeTab === 'Đơn hàng' && (
                <>
                    <div className="detailed-total-card">
                        <div className="total-label">Tổng đơn hàng tháng 7</div>
                        <div className="total-amount">{totalOrdersThisMonth.toLocaleString('vi-VN')}</div>
                    </div>
                    <div className="bar-chart-container">
                        <Bar options={commonBarChartOptions('đơn')} data={ordersBarChartData} />
                    </div>
                    <div className="detailed-list-header"><h4>Số đơn hàng tháng 7 theo sản phẩm</h4></div>
                    <div className="detailed-list-single-column">
                        {ordersByCategory.map((item, index) => (
                            <div key={index} className="detailed-list-item-single">
                                <div className="item-info">
                                    <div className="item-icon" style={{ backgroundColor: index % 2 === 0 ? '#a78bfa' : '#f87171' }}><FaShoppingCart /></div>
                                    <div className="item-details"><div className="item-name">{item._id}</div></div>
                                </div>
                                <div className="item-revenue"><div className="current-revenue">{item.count.toLocaleString('vi-VN')} đơn</div></div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {activeTab === 'Chênh lệch' && (
                <>
                    <div className="detailed-list-header">
                        <h4>So sánh với tháng trước</h4>
                        <span>Doanh thu</span>
                    </div>
                    <div className="detailed-list-single-column">
                        {comparisonData.map((item, index) => (
                            <div key={index} className="detailed-list-item-single variance-item">
                                <div className="item-info">
                                    <div className="item-icon" style={{ backgroundColor: index % 2 === 0 ? '#a78bfa' : '#f87171' }}><FaTshirt /></div>
                                    <div className="item-details">
                                        <div className="item-name">{item._id}</div>
                                        <div className="previous-revenue">Tháng trước: {item.previousRevenue.toLocaleString('vi-VN')}đ</div>
                                    </div>
                                </div>
                                <div className="item-revenue variance-details">
                                    <div className="current-revenue">{item.revenue.toLocaleString('vi-VN')}đ</div>
                                    {item.previousRevenue > 0 && ( // Chỉ hiển thị chênh lệch nếu có dữ liệu tháng trước
                                        <div className={`variance-amount ${item.isGrowth ? 'positive' : 'negative'}`}>
                                            {item.isGrowth ? <FaArrowUp /> : <FaArrowDown />}
                                            {item.difference.toLocaleString('vi-VN')}đ ({item.growth}%)
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};


const DashboardPage = () => {
    const monthlyReport = useOutletContext();
    
    const [isDateModalOpen, setIsDateModalOpen] = useState(false);
    const [isDetailedView, setIsDetailedView] = useState(false);
    const [activeFilterName, setActiveFilterName] = useState('Tháng này');
    
    const [availableMonths, setAvailableMonths] = useState([]);
    const [loadingAvailability, setLoadingAvailability] = useState(false);
    const [modalYear, setModalYear] = useState(new Date().getFullYear());

    useEffect(() => {
        if (isDateModalOpen) {
            const fetchAvailablePeriods = async () => {
                setLoadingAvailability(true);
                try {
                    const { data } = await api.get(`/api/v1/orders/available-periods?year=${modalYear}`);
                    setAvailableMonths(data.months);
                } catch (error) {
                    console.error("Lỗi khi lấy dữ liệu tháng:", error);
                    setAvailableMonths([]);
                } finally {
                    setLoadingAvailability(false);
                }
            };
            fetchAvailablePeriods();
        }
    }, [isDateModalOpen, modalYear]);

    const handleApplyFilter = (filter) => {
        if (filter) {
            const { type, year, value, week } = filter;
            const filterName = type === 'month' ? `Tháng ${value}/${year}` : `Tuần ${week}/${year}`;
            setActiveFilterName(filterName);
        } else {
            setActiveFilterName('Tháng này');
        }
    };

    if (!monthlyReport) {
        return <div className="dashboard-loading"><Spinner /></div>;
    }

    const { 
        currentMonthRevenue, 
        lastMonthRevenue, 
        totalOrdersThisMonth, 
        revenueByCategory,
        lastMonthTotalOrders,
        lastMonthRevenueByCategory
    } = monthlyReport;

    const revenueDiff = currentMonthRevenue - lastMonthRevenue;
    const isIncrease = revenueDiff >= 0;
    const percentage = lastMonthRevenue > 0 ? Math.abs((revenueDiff / lastMonthRevenue) * 100) : 0;
    
    const doughnutChartData = {
        labels: revenueByCategory.map(item => item._id),
        datasets: [{
            data: revenueByCategory.map(item => item.revenue),
            backgroundColor: ['#8B5CF6', '#F87171', '#FBBF24', '#34D399', '#60A5FA', '#F472B6'],
            borderColor: '#fff',
            borderWidth: 3,
            cutout: '75%',
        }],
    };
    
    const doughnutChartOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
    };
    
    const getCategoryIcon = (categoryName) => {
        const name = categoryName.toLowerCase();
        if (name.includes('hoodie')) return <FaUserSecret className="legend-icon-svg" />;
        if (name.includes('sweaters')) return <FaTshirt className="legend-icon-svg" />; 
        if (name.includes('shirt')) return <FaTshirt className="legend-icon-svg" />;
        return <FaTag className="legend-icon-svg" />;
    };

    const comparisonData = revenueByCategory.map(item => {
        const lastMonthData = lastMonthRevenueByCategory || [];
        const previousItem = lastMonthData.find(p => p._id === item._id);
        const previousRevenue = previousItem ? previousItem.revenue : 0;
        const difference = item.revenue - previousRevenue;
        const growth = previousRevenue > 0 ? (difference / previousRevenue) * 100 : 0;
        return {
            _id: item._id,
            revenue: item.revenue,
            previousRevenue,
            difference,
            growth: parseFloat(growth.toFixed(1)),
            isGrowth: difference >= 0,
        };
    });
    const calculatedOrdersByCategory = revenueByCategory.map(item => ({
        _id: item._id,
        count: Math.max(1, Math.round(item.revenue / 200000)),
    }));


    if (isDetailedView) {
        return (
            <div className="dashboard-container">
                <div className="dashboard-wrapper">
                    <DetailedView 
                        categoryData={revenueByCategory} 
                        ordersByCategory={calculatedOrdersByCategory} 
                        comparisonData={comparisonData}
                        currentMonthRevenue={currentMonthRevenue}
                        lastMonthRevenue={lastMonthRevenue}
                        totalOrdersThisMonth={totalOrdersThisMonth}
                        totalOrdersLastMonth={lastMonthTotalOrders}
                        onBack={() => setIsDetailedView(false)} 
                    />
                </div>
            </div>
        );
    }
    
    return (
        <div className="dashboard-container">
            <div className="dashboard-wrapper">
                <div className="dashboard-header">
                    <div className="header-nav">
                        <button className="nav-button"><FaChevronLeft className="nav-icon" /></button>
                        <button className="date-selector" onClick={() => setIsDateModalOpen(true)}>
                            <FaRegCalendarAlt className="date-icon" />
                            <span>{activeFilterName}</span> 
                        </button>
                        <button className="nav-button"><FaChevronRight className="nav-icon" /></button>
                    </div>
                </div>

                <div className="stats-grid">
                    <div className="revenue-card">
                        <div className="revenue-bg-decoration"></div>
                        <div className="revenue-bg-decoration-small"></div>
                        <div className="revenue-content">
                            <div className="revenue-header">
                                <div className="revenue-title"><div className="revenue-icon"><FaDollarSign /></div><span>Tổng doanh thu</span></div>
                                <div className="revenue-main">
                                    <div className="revenue-amount">{currentMonthRevenue.toLocaleString('vi-VN')}đ</div>
                                    <div className="revenue-period">Tháng này</div>
                                </div>
                            </div>
                            <div className="revenue-comparison">
                                <div className="comparison-content">
                                    <div className="comparison-indicator">
                                        <div className={`comparison-arrow ${isIncrease ? 'increase' : 'decrease'}`}>
                                            {isIncrease ? <FaArrowUp /> : <FaArrowDown />}
                                        </div>
                                        <span className="comparison-text">{isIncrease ? 'Tăng' : 'Giảm'} {percentage.toFixed(1)}%</span>
                                    </div>
                                    <span className="comparison-desc">So với tháng trước</span>
                                </div>
                                <div className="comparison-detail">Tháng trước: {lastMonthRevenue.toLocaleString('vi-VN')}đ</div>
                            </div>
                        </div>
                    </div>

                    <div className="orders-card">
                        <div className="orders-header">
                            <div className="orders-title">
                                <div className="orders-icon"><FaShoppingCart /></div>
                                <div>
                                    <div className="orders-label">Đơn hàng</div>
                                    <div className="orders-value">{totalOrdersThisMonth}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="chart-section">
                    <div className="chart-header">
                        <h3 className="chart-title">Doanh thu theo danh mục</h3>
                        <button onClick={() => setIsDetailedView(true)} className="chart-detail-btn">
                            <FaChartBar />
                            <span>Xem chi tiết</span>
                        </button>
                    </div>
                    
                    {revenueByCategory.length > 0 ? (
                        <div className="chart-layout">
                            <div className="chart-container">
                                <div className="chart-area"><Doughnut data={doughnutChartData} options={doughnutChartOptions} /></div>
                                <div className="chart-center">
                                    <div className="chart-center-label">Tổng doanh thu</div>
                                    <div className="chart-center-amount">{currentMonthRevenue.toLocaleString('vi-VN')}đ</div>
                                </div>
                            </div>
                            <div className="chart-legend">
                                {revenueByCategory.map((item, index) => {
                                    const itemPercentage = currentMonthRevenue > 0 ? ((item.revenue / currentMonthRevenue) * 100).toFixed(1) : 0;
                                    return (
                                        <div key={index} className="legend-item">
                                            <div className="legend-icon" style={{ backgroundColor: doughnutChartData.datasets[0].backgroundColor[index] }}>
                                                {getCategoryIcon(item._id)}
                                            </div>
                                            <div className="legend-content">
                                                <div className="legend-name">{item._id}</div>
                                                <div className="legend-percentage">{itemPercentage}% tổng doanh thu</div>
                                            </div>
                                            <div className="legend-value">
                                                <div className="legend-amount">{item.revenue.toLocaleString('vi-VN')}đ</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="chart-empty">
                            <FaChartBar className="empty-icon" />
                            <p>Chưa có doanh thu tháng này để hiển thị</p>
                        </div>
                    )}
                </div>
                
                <DateSelectorModal 
                    isOpen={isDateModalOpen} 
                    onClose={() => setIsDateModalOpen(false)} 
                    onApplyFilter={handleApplyFilter}
                    initialYear={modalYear}
                    onYearChange={setModalYear}
                    availableMonths={availableMonths}
                    loadingAvailability={loadingAvailability}
                />
            </div>
        </div>
    );
};

export default DashboardPage;