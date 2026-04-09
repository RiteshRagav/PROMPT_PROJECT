import { useState } from "react";
import { useGenerateEmailReply } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  GenerateEmailReplyBodyTone,
  GenerateEmailReplyBodyUseCase,
  GenerateEmailReplyBodyLength,
  GenerateEmailReplyResponse,
} from "@workspace/api-client-react";
import {
  Mail,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sparkles,
  Copy,
  Check,
  Loader2,
  MessageSquare,
  ShieldAlert
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Home() {
  const { toast } = useToast();
  
  const [emailContent, setEmailContent] = useState("");
  const [tone, setTone] = useState<GenerateEmailReplyBodyTone>(GenerateEmailReplyBodyTone.professional);
  const [useCase, setUseCase] = useState<GenerateEmailReplyBodyUseCase>(GenerateEmailReplyBodyUseCase["general-work"]);
  const [length, setLength] = useState<GenerateEmailReplyBodyLength>(GenerateEmailReplyBodyLength.medium);
  
  const [result, setResult] = useState<GenerateEmailReplyResponse | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const generateReply = useGenerateEmailReply({
    mutation: {
      onSuccess: (data) => {
        setResult(data);
        toast({
          title: "Reply generated successfully",
          description: "Your AI email reply is ready to review.",
        });
      },
      onError: (error) => {
        toast({
          title: "Failed to generate reply",
          description: error.message || "An unexpected error occurred while generating the reply.",
          variant: "destructive",
        });
      },
    }
  });

  const handleGenerate = () => {
    if (!emailContent.trim()) {
      toast({
        title: "Email content is required",
        description: "Please paste the email you want to reply to.",
        variant: "destructive",
      });
      return;
    }

    generateReply.mutate({
      data: {
        emailContent,
        tone,
        useCase,
        length,
      }
    });
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast({
      title: "Copied to clipboard",
      description: "The text has been copied to your clipboard.",
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const isPending = generateReply.isPending;

  return (
    <div className="min-h-[100dvh] bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-2 sticky top-0 z-10">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Mail className="w-5 h-5 text-primary" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">ReplyPilot</h1>
        <Badge variant="secondary" className="ml-2 font-normal text-xs text-slate-500 bg-slate-100">AI Assistant</Badge>
      </header>

      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        
        {/* Left Panel: Input */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-slate-500" />
              Incoming Email
            </h2>
            <p className="text-sm text-slate-500">Paste the email you received below to generate a smart response.</p>
          </div>

          <Card className="shadow-sm border-slate-200 flex flex-col flex-1 min-h-[400px]">
            <div className="p-4 border-b border-slate-100 flex flex-col gap-4 bg-slate-50/50 rounded-t-xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-700">Tone</label>
                  <Select value={tone} onValueChange={(val: GenerateEmailReplyBodyTone) => setTone(val)}>
                    <SelectTrigger className="bg-white" data-testid="select-tone">
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={GenerateEmailReplyBodyTone.professional}>Professional</SelectItem>
                      <SelectItem value={GenerateEmailReplyBodyTone.friendly}>Friendly</SelectItem>
                      <SelectItem value={GenerateEmailReplyBodyTone.firm}>Firm</SelectItem>
                      <SelectItem value={GenerateEmailReplyBodyTone.empathetic}>Empathetic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-700">Use Case</label>
                  <Select value={useCase} onValueChange={(val: GenerateEmailReplyBodyUseCase) => setUseCase(val)}>
                    <SelectTrigger className="bg-white" data-testid="select-use-case">
                      <SelectValue placeholder="Select use case" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={GenerateEmailReplyBodyUseCase["general-work"]}>General Work</SelectItem>
                      <SelectItem value={GenerateEmailReplyBodyUseCase["customer-support"]}>Customer Support</SelectItem>
                      <SelectItem value={GenerateEmailReplyBodyUseCase.recruiter}>Recruiter</SelectItem>
                      <SelectItem value={GenerateEmailReplyBodyUseCase.client}>Client</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-700">Length</label>
                  <Select value={length} onValueChange={(val: GenerateEmailReplyBodyLength) => setLength(val)}>
                    <SelectTrigger className="bg-white" data-testid="select-length">
                      <SelectValue placeholder="Select length" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={GenerateEmailReplyBodyLength.short}>Short</SelectItem>
                      <SelectItem value={GenerateEmailReplyBodyLength.medium}>Medium</SelectItem>
                      <SelectItem value={GenerateEmailReplyBodyLength.detailed}>Detailed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="p-0 flex-1 flex flex-col">
              <Textarea 
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                placeholder="Paste the email you want to reply to..."
                className="flex-1 min-h-[300px] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none rounded-b-xl resize-none p-4 text-slate-700 leading-relaxed"
                data-testid="input-email-content"
              />
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-white rounded-b-xl">
              <Button 
                onClick={handleGenerate} 
                disabled={isPending || !emailContent.trim()} 
                className="w-full shadow-sm"
                size="lg"
                data-testid="button-generate"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing and Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Reply
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Panel: Output */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              AI Assistant Output
            </h2>
            <p className="text-sm text-slate-500">Review insights and choose the best reply for your situation.</p>
          </div>

          <ScrollArea className="h-full">
            <div className="flex flex-col gap-4 pb-10">
              
              {/* Loading State */}
              {isPending && (
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Skeleton className="h-24 w-full rounded-xl" />
                    <Skeleton className="h-24 w-full rounded-xl" />
                    <Skeleton className="h-24 w-full rounded-xl" />
                  </div>
                  <Skeleton className="h-16 w-full rounded-xl" />
                  <Skeleton className="h-[250px] w-full rounded-xl" />
                  <Skeleton className="h-[200px] w-full rounded-xl" />
                </div>
              )}

              {/* Empty State */}
              {!isPending && !result && (
                <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 min-h-[500px]">
                  <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                    <Sparkles className="w-8 h-8 text-primary/40" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-1">No Reply Generated Yet</h3>
                  <p className="text-slate-500 max-w-sm text-sm">
                    Paste an email in the panel on the left, select your preferred tone and settings, and click Generate to see the magic.
                  </p>
                </div>
              )}

              {/* Results State */}
              {!isPending && result && (
                <>
                  {/* Analysis Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="shadow-sm border-slate-200 bg-white">
                      <CardHeader className="py-3 px-4 flex flex-row items-center justify-between space-y-0 border-b border-slate-50">
                        <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sentiment</CardTitle>
                        <Info className="w-3.5 h-3.5 text-slate-400" />
                      </CardHeader>
                      <CardContent className="p-4 pt-3">
                        <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 capitalize font-medium">
                          {result.sentiment}
                        </Badge>
                      </CardContent>
                    </Card>

                    <Card className="shadow-sm border-slate-200 bg-white">
                      <CardHeader className="py-3 px-4 flex flex-row items-center justify-between space-y-0 border-b border-slate-50">
                        <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Intent</CardTitle>
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                      </CardHeader>
                      <CardContent className="p-4 pt-3">
                        <p className="text-sm font-medium text-slate-800 line-clamp-2">{result.intent}</p>
                      </CardContent>
                    </Card>

                    <Card className={`shadow-sm border-slate-200 bg-white`}>
                      <CardHeader className="py-3 px-4 flex flex-row items-center justify-between space-y-0 border-b border-slate-50">
                        <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Risk Level</CardTitle>
                        <ShieldAlert className={`w-3.5 h-3.5 ${
                          result.riskLevel === 'low' ? 'text-green-500' :
                          result.riskLevel === 'medium' ? 'text-yellow-500' :
                          'text-red-500'
                        }`} />
                      </CardHeader>
                      <CardContent className="p-4 pt-3 flex flex-col gap-2">
                        <Badge 
                          className={`w-fit capitalize font-medium ${
                            result.riskLevel === 'low' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                            result.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' :
                            'bg-red-100 text-red-800 hover:bg-red-100'
                          }`}
                        >
                          {result.riskLevel}
                        </Badge>
                        {result.riskReason && result.riskLevel !== 'low' && (
                          <p className="text-xs text-slate-500 line-clamp-2">{result.riskReason}</p>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Subject Line */}
                  <Card className="shadow-sm border-slate-200 bg-white overflow-hidden group">
                    <div className="flex flex-col sm:flex-row sm:items-center p-1.5 pl-4 gap-3">
                      <div className="flex-1 flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Suggested Subject</span>
                        <p className="text-sm font-medium text-slate-900 truncate">{result.suggestedSubject}</p>
                      </div>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="shrink-0 bg-slate-100 hover:bg-slate-200 text-slate-700"
                        onClick={() => handleCopy(result.suggestedSubject, 'subject')}
                      >
                        {copiedId === 'subject' ? <Check className="w-3.5 h-3.5 mr-1.5" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
                        Copy Subject
                      </Button>
                    </div>
                  </Card>

                  {/* Best Reply */}
                  <Card className="shadow-sm border-primary/20 bg-primary/5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                    <CardHeader className="py-4 px-5 pb-2 flex flex-row items-center justify-between space-y-0">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <CardTitle className="text-sm font-bold text-primary uppercase tracking-wider">Best Reply</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-5 pt-3">
                      <div className="bg-white rounded-lg p-4 border border-primary/10 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed shadow-sm">
                        {result.bestReply}
                      </div>
                    </CardContent>
                    <CardFooter className="px-5 pb-4 pt-0">
                      <Button 
                        className="w-full sm:w-auto shadow-sm"
                        onClick={() => handleCopy(result.bestReply, 'best')}
                      >
                        {copiedId === 'best' ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                        Copy Best Reply
                      </Button>
                    </CardFooter>
                  </Card>

                  {/* Alternative Replies */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.alternativeReplies.map((reply, index) => (
                      <Card key={index} className="shadow-sm border-slate-200 bg-white flex flex-col">
                        <CardHeader className="py-3 px-4 pb-2 border-b border-slate-50">
                          <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Alternative {index + 1}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-3 flex-1">
                          <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
                            {reply}
                          </p>
                        </CardContent>
                        <CardFooter className="px-4 pb-3 pt-0">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full text-slate-600 border-slate-200"
                            onClick={() => handleCopy(reply, `alt-${index}`)}
                          >
                            {copiedId === `alt-${index}` ? <Check className="w-3.5 h-3.5 mr-2" /> : <Copy className="w-3.5 h-3.5 mr-2" />}
                            Copy Alternative
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>

                  {/* Short / Mobile-friendly Reply */}
                  <Card className="shadow-sm border-slate-200 bg-white">
                    <CardHeader className="py-3 px-4 pb-2 flex flex-row items-center justify-between space-y-0 border-b border-slate-50">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Short Reply</CardTitle>
                        <Badge variant="outline" className="text-[10px] uppercase font-bold bg-slate-50 text-slate-400 border-slate-200 py-0 h-4">Mobile-friendly</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-3">
                      <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                        {result.shortReply}
                      </p>
                    </CardContent>
                    <CardFooter className="px-4 pb-3 pt-0">
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700"
                        onClick={() => handleCopy(result.shortReply, 'short')}
                      >
                        {copiedId === 'short' ? <Check className="w-3.5 h-3.5 mr-2" /> : <Copy className="w-3.5 h-3.5 mr-2" />}
                        Copy Short Reply
                      </Button>
                    </CardFooter>
                  </Card>
                </>
              )}
            </div>
          </ScrollArea>
        </div>

      </main>
    </div>
  );
}
