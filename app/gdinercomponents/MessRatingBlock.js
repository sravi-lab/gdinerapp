import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import MessRating from "./MessRating";
import SocketContext from "./Connections/Socket";
 
const MessRatingBlock = () => {
    const [open, setOpen] = useState(false);
    const [lmeal, setMeal] = useState({});
    const subscription = useSelector((state) => state.dinerdata.subscription);
    const user = useSelector((state) => state.appdata.user);
const ctx = useContext(SocketContext);
    useEffect(() => {
        console.log(subscription);
        if (subscription?.status === "yes" && subscription?.usage?.length > 0) {
            const lastMeal = subscription.usage[subscription.usage.length - 1];
            let mealType;
            const currentHour = new Date().getHours();

            if (currentHour >= 0 && currentHour < 11) {
                mealType = "Dinner";
            } else if (currentHour >= 11 && currentHour < 14) {
                mealType = "Breakfast";
            } else if (currentHour >= 14 && currentHour < 18) {
                mealType = "Lunch";
            } else {
                mealType = "Snacks";
            }

            if (lastMeal.meal_type === mealType && (!lastMeal.rate || lastMeal.rate === 0)) {
                setMeal(lastMeal);
                setOpen(true);
            } else {
                setOpen(false);
            }
        }
    }, [subscription]);
    useEffect(() => {
       setTimeout(() => {
           ctx.sendCommand('Check Subscription', { user_id: user.regdno }); 
       }, 1000);
        
    }, [user])
    return (
        <>
            {subscription?.status === "yes" && (
                <MessRating open={open} setOpen={setOpen} meal={lmeal} subscription={subscription.package} />
            )}
        </>
    );
};

export default MessRatingBlock;
