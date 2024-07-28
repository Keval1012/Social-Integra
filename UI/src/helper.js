

export const postDataCountFunc = (arr) => {
    if (arr?.length > 0) {
        const currentDate = new Date();
        const last28DaysDate = new Date();
        last28DaysDate.setDate(currentDate.getDate() - 28);
    
        const last28DaysData = arr.filter(item => new Date(item.created_time) >= last28DaysDate);
        const count = last28DaysData.length;
    
        const totalPostData = arr.filter(item => item).length;
        const result = (count * 100) / totalPostData;
        const lastMonthPost = `${result.toFixed(2)}%`
        // setPostCount(lastMonthPost);
        return lastMonthPost;
    }
};

export const engagementRateData = (arr, period) => {
    if (arr.length > 0) {
        const temp = (arr).filter(o => o.period === period);
        const targetEndTime = temp.map(o => o?.values[1]?.end_time);

        const filteredData = temp.map(item => ({
            ...item,
            values: item.values.filter(value => value.end_time === targetEndTime[0])
        }));

        // const engagedUsersValue = filteredData.find(item => item.name === "page_engaged_users")?.values[0]?.value || 0;
        const engagedUsersValue = filteredData.find(item => item.name === "page_impressions_paid")?.values[0]?.value || 0;
        const impressionsValue = filteredData.find(item => item.name === "page_impressions_unique")?.values[0]?.value || 0;

        if (engagedUsersValue !== 0 && impressionsValue !== 0) {
            const result = (engagedUsersValue * 100) / impressionsValue;
            const engagementRateVal = `${result.toFixed(2)}%`;
            const obj = { engagementRate: engagementRateVal, impressions: impressionsValue, engagementUsers: engagedUsersValue }
            return obj;
        } else if (engagedUsersValue !== 0 && impressionsValue === 0) {
            const obj = { engagementRate: 0, impressions: impressionsValue, engagementUsers: engagedUsersValue }
            return obj;
        } else if (engagedUsersValue === 0 && impressionsValue !== 0) {
            const obj = { engagementRate: 0, impressions: impressionsValue, engagementUsers: engagedUsersValue }
            return obj;
        } else if (engagedUsersValue === 0 && impressionsValue === 0) {
            const obj = { engagementRate: 0, impressions: 0, engagementUsers: 0 }
            return obj;
        }
    }
};