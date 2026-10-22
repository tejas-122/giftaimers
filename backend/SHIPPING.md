# Manual courier quotes

Shipping is free for destination PIN 466001 (Sehore). The existing Rs. 30 COD fee is separate. The previous Rs. 60 flat shipping fee and Rs. 999 free-shipping threshold no longer apply to new orders. Historical orders retain their stored totals.

For other PIN codes:
1. Customer completes the delivery address and submits Request courier quote at checkout. This does not place an order or reserve inventory.
2. Admin opens Courier Quotes, checks carrier serviceability and actual shipping cost, and issues the amount. COD fees are shown separately, so avoid double-counting them in the shipping charge.
3. Customer uses Check courier quote at checkout to retrieve it, reviews the total, then selects Place Order.

Quotes are fixed once issued, valid for seven days from the request, and bound to the account, delivery address, cart quantities, product options and personalization. Changing those details requires a new quote. Stock and prices are rechecked when the order is placed. The checkout quote request also retrieves an existing matching quote, so customers can recover it after re-entering their address if the page was refreshed.

No courier API or messaging integration is configured. Customers check the quote in checkout; staff can use the provided contact details for follow-up or unavailable destinations. Product-page PIN checks explain the policy and do not promise courier serviceability outside 466001.

Deploy both frontend and backend together. Run offline checks with:
node --test backend/tests/shipping.test.js
