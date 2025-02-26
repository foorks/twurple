import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import type { PubSubBasicMessageInfo, PubSubChatMessage } from './PubSubMessage';

/** @private */
export interface PubSubSubscriptionDetail {
	context: 'sub' | 'resub';
	cumulative_months: number;
	streak_months: number;
}

/** @private */
export interface PubSubSubscriptionGiftDetail {
	context: 'subgift' | 'anonsubgift' | 'resubgift' | 'anonresubgift';
	recipient_id: string;
	recipient_user_name: string;
	recipient_display_name: string;
	months: number;
	multi_month_duration: number;
}

/** @private */
export type PubSubSubscriptionMessageData = PubSubBasicMessageInfo & {
	display_name: string;
	sub_plan: 'Prime' | '1000' | '2000' | '3000';
	sub_plan_name: string;
	sub_message: PubSubChatMessage;
} & (PubSubSubscriptionDetail | PubSubSubscriptionGiftDetail);

/**
 * A message that informs about a user subscribing to a channel.
 */
@rtfm<PubSubSubscriptionMessage>('pubsub', 'PubSubSubscriptionMessage', 'userId')
export class PubSubSubscriptionMessage extends DataObject<PubSubSubscriptionMessageData> {
	/**
	 * The ID of the user subscribing to the channel.
	 */
	get userId(): string {
		const data = this[rawDataSymbol];
		return data.context === 'subgift' ||
			data.context === 'anonsubgift' ||
			data.context === 'resubgift' ||
			data.context === 'anonresubgift'
			? data.recipient_id
			: data.user_id;
	}

	/**
	 * The name of the user subscribing to the channel.
	 */
	get userName(): string {
		const data = this[rawDataSymbol];
		return data.context === 'subgift' ||
			data.context === 'anonsubgift' ||
			data.context === 'resubgift' ||
			data.context === 'anonresubgift'
			? data.recipient_user_name
			: data.user_name;
	}

	/**
	 * The display name of the user subscribing to the channel.
	 */
	get userDisplayName(): string {
		const data = this[rawDataSymbol];
		return data.context === 'subgift' ||
			data.context === 'anonsubgift' ||
			data.context === 'resubgift' ||
			data.context === 'anonresubgift'
			? data.recipient_display_name
			: data.display_name;
	}

	/**
	 * The streak amount of months the user has been subscribed for.
	 *
	 * Returns 0 if a gift sub or the streaks months.
	 */
	get streakMonths(): number {
		const data = this[rawDataSymbol];
		return data.context === 'subgift' ||
			data.context === 'anonsubgift' ||
			data.context === 'resubgift' ||
			data.context === 'anonresubgift'
			? 0
			: (data as PubSubSubscriptionDetail).streak_months;
	}

	/**
	 * The cumulative amount of months the user has been subscribed for.
	 *
	 * Returns the months if a gift sub or the cumulative months.
	 */
	get cumulativeMonths(): number {
		const data = this[rawDataSymbol];
		return data.context === 'subgift' ||
			data.context === 'anonsubgift' ||
			data.context === 'resubgift' ||
			data.context === 'anonresubgift'
			? data.months
			: (data as PubSubSubscriptionDetail).cumulative_months;
	}

	/**
	 * The cumulative amount of months the user has been subscribed for.
	 *
	 * Returns the months if a gift sub or the cumulative months.
	 */
	get months(): number {
		return this.cumulativeMonths;
	}

	/**
	 * The time the user subscribed.
	 */
	get time(): Date {
		return new Date(this[rawDataSymbol].time);
	}

	/**
	 * The message sent with the subscription.
	 *
	 * Returns null if the subscription is a gift subscription.
	 */
	get message(): PubSubChatMessage | null {
		return this[rawDataSymbol].context === 'subgift' || this[rawDataSymbol].context === 'anonsubgift'
			? null
			: this[rawDataSymbol].sub_message;
	}

	/**
	 * The plan of the subscription.
	 */
	get subPlan(): string {
		return this[rawDataSymbol].sub_plan;
	}

	/**
	 * Whether the subscription is a resub.
	 */
	get isResub(): boolean {
		return this[rawDataSymbol].context === 'resub';
	}

	/**
	 * Whether the subscription is a gift.
	 */
	get isGift(): boolean {
		return (
			this[rawDataSymbol].context === 'subgift' ||
			this[rawDataSymbol].context === 'resubgift' ||
			this[rawDataSymbol].context === 'anonsubgift' ||
			this[rawDataSymbol].context === 'anonresubgift'
		);
	}

	/**
	 * Whether the subscription is from an anonymous gifter.
	 */
	get isAnonymous(): boolean {
		return this[rawDataSymbol].context === 'anonsubgift' || this[rawDataSymbol].context === 'anonresubgift';
	}

	/**
	 * The ID of the user gifting the subscription.
	 *
	 * Returns null if the subscription is not a gift.
	 */
	get gifterId(): string | null {
		return this.isGift ? this[rawDataSymbol].user_id : null;
	}

	/**
	 * The name of the user gifting the subscription.
	 *
	 * Returns null if the subscription is not a gift.
	 */
	get gifterName(): string | null {
		return this.isGift ? this[rawDataSymbol].user_name : null;
	}

	/**
	 * The display name of the user gifting the subscription.
	 *
	 * Returns null if the subscription is not a gift.
	 */
	get gifterDisplayName(): string | null {
		return this.isGift ? this[rawDataSymbol].display_name : null;
	}

	/**
	 * The duration of the gifted subscription, in months.
	 *
	 * Returns null if the subscription is not a gift.
	 */
	get giftDuration(): number | null {
		const data = this[rawDataSymbol];
		return data.context === 'subgift' ||
			data.context === 'resubgift' ||
			data.context === 'anonsubgift' ||
			data.context === 'anonresubgift'
			? data.multi_month_duration
			: null;
	}
}
