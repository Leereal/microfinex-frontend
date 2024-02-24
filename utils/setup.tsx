"use client";

import { useVerifyTokenMutation } from "@/redux/features/authApiSlice";
import { setAuth, finishInitialLoad } from "@/redux/features/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useEffect } from "react";

export default function Setup() {
  const dispatch = useAppDispatch();
  const [verifyToken] = useVerifyTokenMutation();

  useEffect(() => {
    verifyToken(undefined)
      .unwrap()
      .then(() => {
        // dispatch(setAuth());
      })
      .finally(() => {
        dispatch(finishInitialLoad());
      });
  }, []);
}
