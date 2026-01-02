/**
 * Analytics Service
 * Comprehensive performance analytics for trading
 */

/**
 * Calculate performance metrics
 * @param {Array} trades - Array of user's trades
 * @returns {Object} Performance metrics
 */
export const calculatePerformanceMetrics = (trades) => {
    console.log('[Analytics Service] Calculating performance metrics...')

    if (!trades || trades.length === 0) {
        return {
            winRate: 0,
            lossRate: 0,
            averageWin: 0,
            averageLoss: 0,
            profitFactor: 0,
            bestPerformingStocks: [],
            worstPerformingStocks: [],
            bestPerformingStrategies: [],
            worstPerformingStrategies: [],
            monthlyPerformance: [],
            weeklyPerformance: []
        }
    }

    const closedTrades = trades.filter(t => t.status === 'closed' && t.profitLoss !== null && t.profitLoss !== undefined)
    const totalClosedTrades = closedTrades.length

    // Win rate and loss rate
    const winningTrades = closedTrades.filter(t => (t.profitLoss || 0) > 0)
    const losingTrades = closedTrades.filter(t => (t.profitLoss || 0) < 0)
    const breakevenTrades = closedTrades.filter(t => (t.profitLoss || 0) === 0)

    const winRate = totalClosedTrades > 0
        ? parseFloat(((winningTrades.length / totalClosedTrades) * 100).toFixed(2))
        : 0

    const lossRate = totalClosedTrades > 0
        ? parseFloat(((losingTrades.length / totalClosedTrades) * 100).toFixed(2))
        : 0

    // Average win and loss
    const averageWin = winningTrades.length > 0
        ? parseFloat((winningTrades.reduce((sum, t) => sum + (t.profitLoss || 0), 0) / winningTrades.length).toFixed(2))
        : 0

    const averageLoss = losingTrades.length > 0
        ? parseFloat((Math.abs(losingTrades.reduce((sum, t) => sum + (t.profitLoss || 0), 0)) / losingTrades.length).toFixed(2))
        : 0

    // Profit factor
    const totalWins = winningTrades.reduce((sum, t) => sum + (t.profitLoss || 0), 0)
    const totalLosses = Math.abs(losingTrades.reduce((sum, t) => sum + (t.profitLoss || 0), 0))

    const profitFactor = totalLosses > 0 && totalWins > 0
        ? parseFloat((totalWins / totalLosses).toFixed(2))
        : (totalLosses === 0 && totalWins > 0 ? Infinity : 0)

    // Performance by stock
    const stockPerformance = {}
    closedTrades.forEach(trade => {
        if (!stockPerformance[trade.symbol]) {
            stockPerformance[trade.symbol] = {
                symbol: trade.symbol,
                exchange: trade.exchange,
                totalPnL: 0,
                count: 0,
                wins: 0,
                losses: 0,
                avgPnL: 0
            }
        }
        stockPerformance[trade.symbol].totalPnL += trade.profitLoss || 0
        stockPerformance[trade.symbol].count++
        if ((trade.profitLoss || 0) > 0) {
            stockPerformance[trade.symbol].wins++
        } else if ((trade.profitLoss || 0) < 0) {
            stockPerformance[trade.symbol].losses++
        }
    })

    // Calculate average P&L per stock
    Object.values(stockPerformance).forEach(stock => {
        stock.avgPnL = parseFloat((stock.totalPnL / stock.count).toFixed(2))
        stock.winRate = stock.count > 0 ? parseFloat(((stock.wins / stock.count) * 100).toFixed(2)) : 0
    })

    const bestPerformingStocks = Object.values(stockPerformance)
        .sort((a, b) => b.totalPnL - a.totalPnL)
        .slice(0, 10)
        .map(s => ({
            symbol: s.symbol,
            exchange: s.exchange,
            pnl: parseFloat(s.totalPnL.toFixed(2)),
            count: s.count,
            avgPnL: s.avgPnL,
            winRate: s.winRate
        }))

    const worstPerformingStocks = Object.values(stockPerformance)
        .sort((a, b) => a.totalPnL - b.totalPnL)
        .slice(0, 10)
        .map(s => ({
            symbol: s.symbol,
            exchange: s.exchange,
            pnl: parseFloat(s.totalPnL.toFixed(2)),
            count: s.count,
            avgPnL: s.avgPnL,
            winRate: s.winRate
        }))

    // Performance by strategy (tags)
    const strategyPerformance = {}
    closedTrades.forEach(trade => {
        const tags = trade.tags || []
        if (tags.length === 0) {
            // If no tags, use 'Untagged' as strategy
            tags.push('Untagged')
        }

        tags.forEach(tag => {
            if (!strategyPerformance[tag]) {
                strategyPerformance[tag] = {
                    strategy: tag,
                    totalPnL: 0,
                    count: 0,
                    wins: 0,
                    losses: 0
                }
            }
            strategyPerformance[tag].totalPnL += trade.profitLoss || 0
            strategyPerformance[tag].count++
            if ((trade.profitLoss || 0) > 0) {
                strategyPerformance[tag].wins++
            } else if ((trade.profitLoss || 0) < 0) {
                strategyPerformance[tag].losses++
            }
        })
    })

    // Calculate metrics for strategies
    Object.values(strategyPerformance).forEach(strategy => {
        strategy.avgPnL = parseFloat((strategy.totalPnL / strategy.count).toFixed(2))
        strategy.winRate = strategy.count > 0 ? parseFloat(((strategy.wins / strategy.count) * 100).toFixed(2)) : 0
    })

    const bestPerformingStrategies = Object.values(strategyPerformance)
        .filter(s => s.count >= 2) // At least 2 trades
        .sort((a, b) => b.totalPnL - a.totalPnL)
        .slice(0, 10)
        .map(s => ({
            strategy: s.strategy,
            pnl: parseFloat(s.totalPnL.toFixed(2)),
            count: s.count,
            avgPnL: s.avgPnL,
            winRate: s.winRate
        }))

    const worstPerformingStrategies = Object.values(strategyPerformance)
        .filter(s => s.count >= 2) // At least 2 trades
        .sort((a, b) => a.totalPnL - b.totalPnL)
        .slice(0, 10)
        .map(s => ({
            strategy: s.strategy,
            pnl: parseFloat(s.totalPnL.toFixed(2)),
            count: s.count,
            avgPnL: s.avgPnL,
            winRate: s.winRate
        }))

    // Monthly performance
    const monthlyPerformance = {}
    closedTrades.forEach(trade => {
        if (trade.exitDate) {
            const date = new Date(trade.exitDate)
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

            if (!monthlyPerformance[monthKey]) {
                monthlyPerformance[monthKey] = {
                    month: monthKey,
                    totalPnL: 0,
                    count: 0,
                    wins: 0,
                    losses: 0
                }
            }
            monthlyPerformance[monthKey].totalPnL += trade.profitLoss || 0
            monthlyPerformance[monthKey].count++
            if ((trade.profitLoss || 0) > 0) {
                monthlyPerformance[monthKey].wins++
            } else if ((trade.profitLoss || 0) < 0) {
                monthlyPerformance[monthKey].losses++
            }
        }
    })

    const monthlyPerformanceArray = Object.values(monthlyPerformance)
        .sort((a, b) => a.month.localeCompare(b.month))
        .map(m => ({
            month: m.month,
            pnl: parseFloat(m.totalPnL.toFixed(2)),
            count: m.count,
            wins: m.wins,
            losses: m.losses,
            winRate: m.count > 0 ? parseFloat(((m.wins / m.count) * 100).toFixed(2)) : 0
        }))

    // Weekly performance (last 12 weeks)
    const weeklyPerformance = {}
    const now = new Date()
    const twelveWeeksAgo = new Date(now.getTime() - (12 * 7 * 24 * 60 * 60 * 1000))

    closedTrades.forEach(trade => {
        if (trade.exitDate) {
            const exitDate = new Date(trade.exitDate)
            if (exitDate >= twelveWeeksAgo) {
                // Get week number
                const weekStart = new Date(exitDate)
                weekStart.setDate(exitDate.getDate() - exitDate.getDay()) // Start of week (Sunday)
                const weekKey = `${weekStart.getFullYear()}-W${String(Math.ceil((weekStart.getDate() + (weekStart.getDay() === 0 ? 6 : weekStart.getDay() - 1)) / 7)).padStart(2, '0')}`

                if (!weeklyPerformance[weekKey]) {
                    weeklyPerformance[weekKey] = {
                        week: weekKey,
                        totalPnL: 0,
                        count: 0,
                        wins: 0,
                        losses: 0
                    }
                }
                weeklyPerformance[weekKey].totalPnL += trade.profitLoss || 0
                weeklyPerformance[weekKey].count++
                if ((trade.profitLoss || 0) > 0) {
                    weeklyPerformance[weekKey].wins++
                } else if ((trade.profitLoss || 0) < 0) {
                    weeklyPerformance[weekKey].losses++
                }
            }
        }
    })

    const weeklyPerformanceArray = Object.values(weeklyPerformance)
        .sort((a, b) => a.week.localeCompare(b.week))
        .slice(-12) // Last 12 weeks
        .map(w => ({
            week: w.week,
            pnl: parseFloat(w.totalPnL.toFixed(2)),
            count: w.count,
            wins: w.wins,
            losses: w.losses,
            winRate: w.count > 0 ? parseFloat(((w.wins / w.count) * 100).toFixed(2)) : 0
        }))

    console.log(`[Analytics Service] Calculated metrics for ${totalClosedTrades} closed trades`)

    return {
        winRate,
        lossRate,
        averageWin,
        averageLoss,
        profitFactor,
        bestPerformingStocks,
        worstPerformingStocks,
        bestPerformingStrategies,
        worstPerformingStrategies,
        monthlyPerformance: monthlyPerformanceArray,
        weeklyPerformance: weeklyPerformanceArray
    }
}

/**
 * Identify strengths (what's working well)
 * @param {Array} trades - Array of user's trades
 * @returns {Array} Array of strength objects
 */
export const identifyStrengths = (trades) => {
    console.log('[Analytics Service] Identifying strengths...')

    const strengths = []
    const closedTrades = trades.filter(t => t.status === 'closed' && t.profitLoss !== null && t.profitLoss !== undefined)

    if (closedTrades.length === 0) {
        return strengths
    }

    const metrics = calculatePerformanceMetrics(trades)

    // Strength 1: High win rate
    if (metrics.winRate >= 60) {
        strengths.push({
            title: 'High Win Rate',
            description: `Your win rate is ${metrics.winRate.toFixed(1)}%, which is excellent. You're picking winning trades consistently.`,
            category: 'performance',
            value: metrics.winRate
        })
    } else if (metrics.winRate >= 50) {
        strengths.push({
            title: 'Good Win Rate',
            description: `Your win rate is ${metrics.winRate.toFixed(1)}%, which is above average. Keep refining your entry criteria.`,
            category: 'performance',
            value: metrics.winRate
        })
    }

    // Strength 2: Good profit factor
    if (metrics.profitFactor >= 2.0) {
        strengths.push({
            title: 'Excellent Profit Factor',
            description: `Your profit factor is ${metrics.profitFactor}. This means your average wins are significantly larger than your average losses.`,
            category: 'risk_management',
            value: metrics.profitFactor
        })
    } else if (metrics.profitFactor >= 1.5) {
        strengths.push({
            title: 'Good Profit Factor',
            description: `Your profit factor is ${metrics.profitFactor}. Your wins are larger than your losses on average.`,
            category: 'risk_management',
            value: metrics.profitFactor
        })
    }

    // Strength 3: Best performing stocks
    if (metrics.bestPerformingStocks.length > 0) {
        const topStock = metrics.bestPerformingStocks[0]
        if (topStock.pnl > 0 && topStock.count >= 3) {
            strengths.push({
                title: `Strong Performance in ${topStock.symbol}`,
                description: `${topStock.symbol} has been your best performer with ₹${topStock.pnl.toFixed(2)} total P&L across ${topStock.count} trades (avg: ₹${topStock.avgPnL.toFixed(2)}, win rate: ${topStock.winRate.toFixed(1)}%).`,
                category: 'stock_selection',
                value: topStock.pnl
            })
        }
    }

    // Strength 4: Best performing strategy
    if (metrics.bestPerformingStrategies.length > 0) {
        const topStrategy = metrics.bestPerformingStrategies[0]
        if (topStrategy.pnl > 0 && topStrategy.count >= 3) {
            strengths.push({
                title: `Strong Strategy: ${topStrategy.strategy}`,
                description: `Your "${topStrategy.strategy}" strategy is working well with ₹${topStrategy.pnl.toFixed(2)} total P&L across ${topStrategy.count} trades (avg: ₹${topStrategy.avgPnL.toFixed(2)}, win rate: ${topStrategy.winRate.toFixed(1)}%).`,
                category: 'strategy',
                value: topStrategy.pnl
            })
        }
    }

    // Strength 5: Consistent monthly performance
    if (metrics.monthlyPerformance.length >= 3) {
        const profitableMonths = metrics.monthlyPerformance.filter(m => m.pnl > 0).length
        const profitablePercentage = (profitableMonths / metrics.monthlyPerformance.length) * 100

        if (profitablePercentage >= 70) {
            strengths.push({
                title: 'Consistent Monthly Performance',
                description: `You've been profitable in ${profitableMonths} out of ${metrics.monthlyPerformance.length} months (${profitablePercentage.toFixed(0)}%), showing strong consistency.`,
                category: 'consistency',
                value: profitablePercentage
            })
        }
    }

    console.log(`[Analytics Service] Identified ${strengths.length} strengths`)

    return strengths
}

/**
 * Identify weaknesses (areas for improvement)
 * @param {Array} trades - Array of user's trades
 * @returns {Array} Array of weakness objects
 */
export const identifyWeaknesses = (trades) => {
    console.log('[Analytics Service] Identifying weaknesses...')

    const weaknesses = []
    const closedTrades = trades.filter(t => t.status === 'closed' && t.profitLoss !== null && t.profitLoss !== undefined)

    if (closedTrades.length === 0) {
        return weaknesses
    }

    const metrics = calculatePerformanceMetrics(trades)

    // Weakness 1: Low win rate
    if (metrics.winRate < 40) {
        weaknesses.push({
            title: 'Low Win Rate',
            description: `Your win rate is ${metrics.winRate.toFixed(1)}%, which is below optimal. Focus on improving entry criteria and wait for high-probability setups.`,
            category: 'performance',
            value: metrics.winRate,
            recommendation: 'Review your entry strategies and be more selective with trade setups.'
        })
    } else if (metrics.winRate < 50) {
        weaknesses.push({
            title: 'Below Average Win Rate',
            description: `Your win rate is ${metrics.winRate.toFixed(1)}%. There's room for improvement in trade selection.`,
            category: 'performance',
            value: metrics.winRate,
            recommendation: 'Focus on quality over quantity in trade selection.'
        })
    }

    // Weakness 2: Poor profit factor
    if (metrics.profitFactor < 1.0 && metrics.profitFactor !== 0) {
        weaknesses.push({
            title: 'Profit Factor Below 1.0',
            description: `Your profit factor is ${metrics.profitFactor}. This means your losses are larger than your wins on average. Focus on risk management.`,
            category: 'risk_management',
            value: metrics.profitFactor,
            recommendation: 'Work on cutting losses quickly and letting winners run. Consider using stop-loss orders.'
        })
    }

    // Weakness 3: Worst performing stocks
    if (metrics.worstPerformingStocks.length > 0) {
        const worstStock = metrics.worstPerformingStocks[0]
        if (worstStock.pnl < 0 && worstStock.count >= 3) {
            weaknesses.push({
                title: `Poor Performance in ${worstStock.symbol}`,
                description: `${worstStock.symbol} has been losing money with ₹${Math.abs(worstStock.pnl).toFixed(2)} total loss across ${worstStock.count} trades (avg: ₹${worstStock.avgPnL.toFixed(2)}, win rate: ${worstStock.winRate.toFixed(1)}%).`,
                category: 'stock_selection',
                value: worstStock.pnl,
                recommendation: `Consider avoiding ${worstStock.symbol} or revisiting your approach to trading this stock.`
            })
        }
    }

    // Weakness 4: Worst performing strategy
    if (metrics.worstPerformingStrategies.length > 0) {
        const worstStrategy = metrics.worstPerformingStrategies[0]
        if (worstStrategy.pnl < 0 && worstStrategy.count >= 3) {
            weaknesses.push({
                title: `Weak Strategy: ${worstStrategy.strategy}`,
                description: `Your "${worstStrategy.strategy}" strategy is underperforming with ₹${Math.abs(worstStrategy.pnl).toFixed(2)} total loss across ${worstStrategy.count} trades (avg: ₹${worstStrategy.avgPnL.toFixed(2)}, win rate: ${worstStrategy.winRate.toFixed(1)}%).`,
                category: 'strategy',
                value: worstStrategy.pnl,
                recommendation: `Revise or eliminate the "${worstStrategy.strategy}" strategy, or reduce position sizes when using it.`
            })
        }
    }

    // Weakness 5: Inconsistent performance
    if (metrics.monthlyPerformance.length >= 3) {
        const losingMonths = metrics.monthlyPerformance.filter(m => m.pnl < 0).length
        const losingPercentage = (losingMonths / metrics.monthlyPerformance.length) * 100

        if (losingPercentage >= 50) {
            weaknesses.push({
                title: 'Inconsistent Performance',
                description: `You've had losses in ${losingMonths} out of ${metrics.monthlyPerformance.length} months (${losingPercentage.toFixed(0)}%), indicating inconsistency.`,
                category: 'consistency',
                value: losingPercentage,
                recommendation: 'Focus on developing consistent trading habits and sticking to your proven strategies.'
            })
        }
    }

    // Weakness 6: Large average loss
    if (metrics.averageLoss > metrics.averageWin * 1.5 && metrics.averageWin > 0) {
        weaknesses.push({
            title: 'Large Average Loss',
            description: `Your average loss (₹${metrics.averageLoss.toFixed(2)}) is significantly larger than your average win (₹${metrics.averageWin.toFixed(2)}). This suggests poor risk management.`,
            category: 'risk_management',
            value: metrics.averageLoss,
            recommendation: 'Implement strict stop-loss orders and exit losing trades faster.'
        })
    }

    console.log(`[Analytics Service] Identified ${weaknesses.length} weaknesses`)

    return weaknesses
}

/**
 * Generate actionable insights
 * @param {Array} trades - Array of user's trades
 * @returns {Array} Array of insight objects
 */
export const generateInsights = (trades) => {
    console.log('[Analytics Service] Generating insights...')

    const insights = []
    const closedTrades = trades.filter(t => t.status === 'closed' && t.profitLoss !== null && t.profitLoss !== undefined)

    if (closedTrades.length === 0) {
        insights.push({
            type: 'info',
            title: 'Start Trading to See Insights',
            message: 'Add and close some trades to get performance insights and recommendations.',
            priority: 'low'
        })
        return insights
    }

    const metrics = calculatePerformanceMetrics(trades)
    const strengths = identifyStrengths(trades)
    const weaknesses = identifyWeaknesses(trades)

    // Insight 1: Overall performance summary
    const totalPnL = closedTrades.reduce((sum, t) => sum + (t.profitLoss || 0), 0)
    if (totalPnL > 0) {
        insights.push({
            type: 'success',
            title: 'Overall Profitable Trading',
            message: `You're currently profitable with ₹${totalPnL.toFixed(2)} total P&L. Keep up the good work and focus on maintaining consistency.`,
            priority: 'high'
        })
    } else {
        insights.push({
            type: 'warning',
            title: 'Focus on Becoming Profitable',
            message: `You're currently at ₹${totalPnL.toFixed(2)} total P&L. Review your trading plan and focus on ${weaknesses.length > 0 ? weaknesses[0].recommendation : 'improving your win rate and risk management'}.`,
            priority: 'high'
        })
    }

    // Insight 2: Win rate insight
    if (metrics.winRate < 50) {
        insights.push({
            type: 'warning',
            title: 'Win Rate Below 50%',
            message: `Your win rate is ${metrics.winRate.toFixed(1)}%. While you can still be profitable with proper risk management, improving your win rate will make trading easier. Focus on higher probability setups.`,
            priority: 'medium'
        })
    }

    // Insight 3: Risk-reward insight
    if (metrics.averageWin > 0 && metrics.averageLoss > 0) {
        const riskRewardRatio = metrics.averageWin / metrics.averageLoss
        if (riskRewardRatio < 1.0) {
            insights.push({
                type: 'danger',
                title: 'Poor Risk-Reward Ratio',
                message: `Your average win (₹${metrics.averageWin.toFixed(2)}) is smaller than your average loss (₹${metrics.averageLoss.toFixed(2)}). Aim for at least a 2:1 risk-reward ratio by letting winners run and cutting losses quickly.`,
                priority: 'high'
            })
        } else if (riskRewardRatio >= 2.0) {
            insights.push({
                type: 'success',
                title: 'Excellent Risk-Reward Ratio',
                message: `Your risk-reward ratio is ${riskRewardRatio.toFixed(2)}:1. This means you're letting winners run while cutting losses quickly - excellent risk management!`,
                priority: 'low'
            })
        }
    }

    // Insight 4: Stock diversification
    const uniqueStocks = new Set(closedTrades.map(t => t.symbol)).size
    if (uniqueStocks < 3 && closedTrades.length > 5) {
        insights.push({
            type: 'info',
            title: 'Consider Diversification',
            message: `You've traded only ${uniqueStocks} stock(s) across ${closedTrades.length} trades. While focus can be good, consider diversifying to reduce concentration risk.`,
            priority: 'low'
        })
    }

    // Insight 5: Trade frequency
    if (closedTrades.length > 100) {
        const avgTradesPerMonth = closedTrades.length / (metrics.monthlyPerformance.length || 1)
        if (avgTradesPerMonth > 20) {
            insights.push({
                type: 'warning',
                title: 'High Trade Frequency',
                message: `You're averaging ${avgTradesPerMonth.toFixed(1)} trades per month. Quality over quantity - focus on high-probability setups rather than frequent trading.`,
                priority: 'medium'
            })
        }
    }

    // Insight 6: Add top strength and weakness
    if (strengths.length > 0) {
        insights.push({
            type: 'success',
            title: `Key Strength: ${strengths[0].title}`,
            message: strengths[0].description,
            priority: 'low'
        })
    }

    if (weaknesses.length > 0) {
        insights.push({
            type: 'warning',
            title: `Key Area for Improvement: ${weaknesses[0].title}`,
            message: `${weaknesses[0].description} ${weaknesses[0].recommendation || ''}`,
            priority: 'high'
        })
    }

    console.log(`[Analytics Service] Generated ${insights.length} insights`)

    return insights
}

/**
 * Main function to analyze all performance aspects
 * @param {Array} trades - Array of user's trades
 * @returns {Object} Complete analytics data
 */
export const analyzePerformance = (trades) => {
    console.log(`[Analytics Service] Starting comprehensive performance analysis for ${trades?.length || 0} trades...`)

    if (!trades || trades.length === 0) {
        return {
            // Basic stats for StatsCards component
            totalPnL: 0,
            winRate: 0,
            totalTrades: 0,
            openPositions: 0,

            // Detailed metrics
            metrics: calculatePerformanceMetrics([]),
            strengths: [],
            weaknesses: [],
            insights: [],
            winLossDistribution: { wins: 0, losses: 0, breakeven: 0 },
            stockPerformance: [],
            equityCurve: []
        }
    }

    // Calculate all metrics
    const metrics = calculatePerformanceMetrics(trades)

    // Identify strengths and weaknesses
    const strengths = identifyStrengths(trades)
    const weaknesses = identifyWeaknesses(trades)

    // Generate insights
    const insights = generateInsights(trades)

    // Calculate win/loss distribution (for frontend compatibility)
    const closedTrades = trades.filter(t => t.status === 'closed' && t.profitLoss !== null && t.profitLoss !== undefined)
    const winLossDistribution = {
        wins: closedTrades.filter(t => (t.profitLoss || 0) > 0).length,
        losses: closedTrades.filter(t => (t.profitLoss || 0) < 0).length,
        breakeven: closedTrades.filter(t => (t.profitLoss || 0) === 0).length
    }

    // Stock performance (for frontend compatibility)
    const stockPerformance = metrics.bestPerformingStocks.map(s => ({
        symbol: s.symbol,
        pnl: s.pnl,
        count: s.count
    }))

    // Equity curve (cumulative P&L over time)
    const equityCurve = []
    let cumulativePnL = 0
    const sortedTrades = [...closedTrades]
        .filter(t => t.exitDate)
        .sort((a, b) => new Date(a.exitDate) - new Date(b.exitDate))

    sortedTrades.forEach(trade => {
        cumulativePnL += trade.profitLoss || 0
        equityCurve.push({
            date: new Date(trade.exitDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
            pnl: parseFloat(cumulativePnL.toFixed(2)),
            dateValue: new Date(trade.exitDate).toISOString()
        })
    })

    // Calculate basic stats for StatsCards component
    const totalTrades = trades.length
    const openTrades = trades.filter(t => t.status === 'open').length
    const closedTradesForStats = trades.filter(t => t.status === 'closed')
    const totalPnL = closedTradesForStats.reduce((sum, t) => sum + (t.profitLoss || 0), 0)
    const winRate = metrics.winRate // Already calculated

    console.log('[Analytics Service] ✓ Analysis completed successfully')

    return {
        // Basic stats for StatsCards component
        totalPnL: parseFloat(totalPnL.toFixed(2)),
        winRate: parseFloat(winRate.toFixed(2)),
        totalTrades,
        openPositions: openTrades,

        // Detailed metrics
        metrics,
        strengths,
        weaknesses,
        insights,
        winLossDistribution,
        stockPerformance,
        equityCurve
    }
}

