package com.xiaomi.chat.api;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * 消息归属角色，对应协议中的 role 字段。
 */
public enum ChatRole {

    /** 用户 */
    USER("user"),
    /** 助手 */
    ASSISTANT("assistant");

    private final String value;

    ChatRole(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static ChatRole from(String value) {
        for (ChatRole role : values()) {
            if (role.value.equalsIgnoreCase(value)) {
                return role;
            }
        }
        throw new IllegalArgumentException("未知角色: " + value);
    }
}
