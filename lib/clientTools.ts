import { ClientToolImplementation } from 'ultravox-client';

// Client-implemented tool for Order Details
// export const updateOrderTool: ClientToolImplementation = (parameters) => {
//   const { ...orderData } = parameters;
//   console.debug("Received order details update:", orderData.orderDetailsData);

//   if (typeof window !== "undefined") {
//     const event = new CustomEvent("orderDetailsUpdated", {
//       detail: orderData.orderDetailsData,
//     });
//     window.dispatchEvent(event);
//   }

//   return "Updated the order details.";
// };

// 使用事件机制实现 speechAnalysis
export const speechAnalysisTool: ClientToolImplementation = (parameters) => {
  console.log("speechAnalysisTool called with parameters:", parameters);
  const { ...analysisData } = parameters;
  console.debug("Received speech analysis data:", analysisData.analysisData);

  if (typeof window !== "undefined") {
    const event = new CustomEvent("speechAnalysisUpdated", {
      detail: analysisData.analysisData,
    });
    console.log("Dispatching speechAnalysisUpdated event with data:", event.detail);
    window.dispatchEvent(event);
  }

  return "Speech analysis completed.";
};

// 使用事件机制实现 errorCorrection
export const errorCorrectionTool: ClientToolImplementation = (parameters) => {
  console.log("errorCorrectionTool called with parameters:", parameters);
  const { ...correctionData } = parameters;
  console.debug("Received error correction data:", correctionData.correctionData);

  if (typeof window !== "undefined") {
    const event = new CustomEvent("errorCorrectionUpdated", {
      detail: correctionData.correctionData,
    });
    console.log("Dispatching errorCorrectionUpdated event with data:", event.detail);
    window.dispatchEvent(event);
  }

  return "Error correction completed.";
};
