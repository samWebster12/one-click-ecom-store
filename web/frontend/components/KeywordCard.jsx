import { useState } from "react";
import {
  Card,
  Heading,
  TextContainer,
  DisplayText,
  TextStyle,
  Stack
} from "@shopify/polaris";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";


export function KeywordCard(props) {


    return (
        <>
            <Stack.Item>
                <Card
                    sectioned
                >
                    <TextContainer spacing="loose">
                        <p>
                            {props.keyword}
                        </p>
                    </TextContainer>
                </Card>
            </Stack.Item>
        </>
    );
}