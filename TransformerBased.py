from transformers import T5ForConditionalGeneration, T5Tokenizer

# Load model and tokenizer
model_name = "t5-base"
tokenizer = T5Tokenizer.from_pretrained(model_name)
model = T5ForConditionalGeneration.from_pretrained(model_name)

def explain_phrase(phrase: str) -> str:
    # Format prompt
    prompt = f"explain: {phrase}"

    # Encode input
    input_ids = tokenizer.encode(prompt, return_tensors="pt")

    # Generate output
    output_ids = model.generate(input_ids, max_length=50, num_beams=4, early_stopping=True)

    # Decode and return
    return tokenizer.decode(output_ids[0], skip_special_tokens=True)


print(explain_phrase("break the ice"))
print(explain_phrase("hit the nail on the head"))
print(explain_phrase("artificial intelligence"))
