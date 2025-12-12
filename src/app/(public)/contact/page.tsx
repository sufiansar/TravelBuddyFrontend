"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      toast.success("Thank you! Your message has been sent successfully.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error: any) {
      toast.error(error.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-4 text-foreground">
          Contact Us
        </h1>
        <p className="text-center text-muted-foreground mb-12">
          We'd love to hear from you. Send us a message!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-card rounded-lg shadow-lg p-6 text-center border border-border">
            <div className="text-4xl mb-4">📧</div>
            <h3 className="text-lg font-bold mb-2 text-foreground">Email</h3>
            <p className="text-muted-foreground">support@travelbuddy.com</p>
          </div>

          <div className="bg-card rounded-lg shadow-lg p-6 text-center border border-border">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-lg font-bold mb-2 text-foreground">Phone</h3>
            <p className="text-muted-foreground">+1 (555) 123-4567</p>
          </div>

          <div className="bg-card rounded-lg shadow-lg p-6 text-center border border-border">
            <div className="text-4xl mb-4">📍</div>
            <h3 className="text-lg font-bold mb-2 text-foreground">Location</h3>
            <p className="text-muted-foreground">123 Travel Lane, NYC, USA</p>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Name
                </label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Email
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your email"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-foreground">
                Subject
              </label>
              <Input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Message subject"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-foreground">
                Message
              </label>
              <Textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your message"
                rows={6}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
