from transformers import Trainer, TrainingArguments, AutoTokenizer, AutoModelForCausalLM
from datasets import load_dataset

# Load the dataset (JSONL format)
dataset = load_dataset("json", data_files={"train": "dorking_dataset.jsonl"})

# Load tokenizer and model (TinyLlama 1.1B)
model_name = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
tokenizer = AutoTokenizer.from_pretrained(model_name)

# Ensure padding is correctly handled for causal models
tokenizer.pad_token = tokenizer.eos_token
tokenizer.padding_side = "left"

# Tokenize the dataset
def tokenize_function(examples):
    tokenized_inputs = tokenizer(
        examples["prompt"],
        padding="max_length",
        truncation=True,
        max_length=512
    )
    tokenized_inputs["labels"] = tokenized_inputs["input_ids"].copy()  # Ensure labels are included
    return tokenized_inputs

# Apply tokenization
tokenized_datasets = dataset.map(tokenize_function, batched=True, remove_columns=["prompt"])

# Training arguments
training_args = TrainingArguments(
    output_dir="./results",             # Output directory for model checkpoints
    evaluation_strategy="no",           # Disable evaluation (Fixed)
    save_strategy="epoch",              # Save model every epoch
    learning_rate=5e-5,                 # Learning rate
    per_device_train_batch_size=8,      # Batch size per device during training
    num_train_epochs=3,                 # Number of epochs
    weight_decay=0.01,                  # Regularization
    logging_dir="./logs",               # Log directory
    logging_steps=10,                   # Log every 10 steps
    save_total_limit=2,                 # Keep only last 2 checkpoints
)

# Initialize Trainer
trainer = Trainer(
    model=AutoModelForCausalLM.from_pretrained(model_name),
    args=training_args,
    train_dataset=tokenized_datasets["train"],
)

# Start fine-tuning
trainer.train()

# Save fine-tuned model
trainer.model.save_pretrained("./fine_tuned_model")
tokenizer.save_pretrained("./fine_tuned_model")
